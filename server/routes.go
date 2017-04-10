package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/mediocregopher/radix.v2/redis"
	"golang.org/x/crypto/bcrypt"
)

//----- SIGNUP -----//

func signupHandler(db *gorm.DB, conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		var u User
		var un UserAuth

		decoder := json.NewDecoder(req.Body)
		defer req.Body.Close()
		err := decoder.Decode(&u)
		if err != nil {
			panic(err)
		}

		//check if username exists
		db.Where(&UserAuth{Username: u.Username}).First(&un)
		if un.Username != "" {
			http.Error(w, "Username already taken", http.StatusForbidden)
			return
		}

		//check if email exists
		db.Where(&UserAuth{Email: u.Email}).First(&un)
		if un.Email != "" {
			http.Error(w, "Email already taken", http.StatusForbidden)
			return
		}

		//generate encrypted password
		bs, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		//generate user in database
		user := UserAuth{Username: u.Username, Name: u.Name, Email: u.Email, Password: string(bs)}

		db.NewRecord(user)
		db.Create(&user)

		conn.Cmd("HMSET", u.Username, "Survey", "false")

		w.Header().Set("Content-Type", "application/json")
		j, _ := json.Marshal("User created")
		w.Write(j)
		return
	})
}

//----- LOGIN -----//

func loginHandler(db *gorm.DB, conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

		if req.Method == http.MethodPost {
			var u User
			var un UserAuth
			var usp UserProfile

			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&u)
			if err != nil {
				panic(err)
			}

			//check if username is valid
			db.Where(&UserAuth{Username: u.Username}).First(&un)
			log.Println(un.Username)
			if un.Username == "" {
				http.Error(w, "Username or password does not match", http.StatusForbidden)
				return
			}

			//compare passwords
			err = bcrypt.CompareHashAndPassword([]byte(un.Password), []byte(u.Password))

			if err != nil {
				http.Error(w, "Username or password does not match", http.StatusForbidden)
				return
			}

			//issue token upon successful login
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"username": u.Username,
				"iss":      "https://kindredchat.io",
				"exp":      time.Now().Add(time.Hour * 72).Unix(),
			})

			//sign token
			tokenString, err := token.SignedString(mySigningKey)

			//store in db and set header
			w.Header().Set("Content-Type", "application/json")
			j, _ := json.Marshal(tokenString)
			db.Model(&un).Update("Token", j)

			//store token and user profile in cache
			rj := j[1 : len(j)-1]
			db.Where("user_auth_id = ?", un.ID).First(&usp)
			out, err := json.Marshal(usp)
			if err != nil {
				panic(err)
			}

			conn.Cmd("HMSET", u.Username, "Token", rj, "Name", un.Name, "Profile", string(out))

			//send token back as response
			w.Write(j)
		}
	})
}

//----- LOGOUT -----//

func logoutHandler(conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if req.Method == http.MethodPost {
			var c Cookie

			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&c)
			if err != nil {
				panic(err)
			}

			conn.Cmd("HDEL", c.Username, "Token")

			j, err := json.Marshal("User logged out")
			w.Write(j)
		}
	})
}

//----- CHECK TOKEN -----//
func tokenHandler(conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		var c Cookie
		var b bool

		decoder := json.NewDecoder(req.Body)
		defer req.Body.Close()
		err := decoder.Decode(&c)
		if err != nil {
			panic(err)
		}

		if req.Method == http.MethodPost {
			res, err := conn.Cmd("HGET", c.Username, "Token").Str()
			if err != nil {
				panic(err)
			}
			b = c.Token == res

			w.Header().Set("Content-Type", "application/json")
			j, _ := json.Marshal(b)
			w.Write(j)
		}
	})
}

// ----- CHECK VISITS (first time users) -----//

func visitHandler(conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if req.Method == http.MethodGet {
			u := req.URL.Query()
			log.Println("uri is", u["q"])
			res, err := conn.Cmd("HGET", u["q"], "Survey").Str()
			if err != nil {
				panic(err)
			}

			w.Header().Set("Content-Type", "application/json")
			j, _ := json.Marshal(res)
			w.Write(j)
		} 
	})
}

//----- PROFILE -----//

func profileHandler(db *gorm.DB, conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		//handle post
		if req.Method == http.MethodPost {
			var us UserSurvey
			var un UserAuth
			var usp UserProfile

			rh := req.Header.Get("Authorization")[7:]

			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&us)
			if err != nil {
				panic(err)
			}

			db.Where(&UserAuth{Token: "\"" + rh + "\""}).First(&un)
			us.ID = un.ID
			db.Where("user_auth_id = ?", un.ID).First(&usp)
			//create new user profile entry
			if usp.UserAuthID == 0 {
				f := defaultSurvey(us)
				//create new database record
				db.NewRecord(f)
				db.Create(&f)

				//add profile to cache
				out, err := json.Marshal(usp)
				if err != nil {
					panic(err)
				}
				conn.Cmd("HMSET", un.Username, "Profile", string(out), "Survey", "true")

				//write response back
				w.Header().Set("Content-Type", "application/json")
				j, _ := json.Marshal("Profile posted")
				w.Write(j)
			} else {
				//update existing user profile entry in db
				f := defaultSurvey(us)
				db.Model(&usp).Updates(f)

				//updata profile in cache
				out, err := json.Marshal(usp)
				if err != nil {
					panic(err)
				}
				conn.Cmd("HMSET", un.Username, "Profile", string(out), "Survey", "true	")

				//write response back
				w.Header().Set("Content-Type", "application/json")
				j, _ := json.Marshal("Profile updated")
				w.Write(j)
			}
		}

		//handle get
		if req.Method == http.MethodGet {
			u := req.URL.Query()

			res, err := conn.Cmd("HGET", u["q"], "Profile").Str()
			if err != nil {
				panic(err)
			}

			w.Header().Set("Content-Type", "application/json")
			j, _ := json.Marshal(res)
			w.Write(j)
		}
	})
}

//----- FEEDBACK -----//

func feedbackHandler(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if req.Method == http.MethodGet {
			fmt.Println("get feedback route")
			var randQuestion FeedbackQuestion
			var questionCount int
			db.Table("feedback_questions").Count(&questionCount)
			// TODO: only do next lines if question count is more than 0
			db.Find(&randQuestion, rand.Intn(questionCount)+1)
			q, err := json.Marshal(randQuestion)
			if err != nil {
				fmt.Println(err)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write(q)
		} else {
			// post feedback answer
			fmt.Println("feedback post")
			var newAnswer FeedbackAnswer
			var user UserAuth
			var question FeedbackQuestion
			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&newAnswer)
			if err != nil {
				panic(err)
			}
			db.Model(&newAnswer).Related(&user)
			db.Model(&newAnswer).Related(&question)
			if user.ID != 0 && question.ID != 0 {
				db.NewRecord(newAnswer)
				db.Create(&newAnswer).Create(&newAnswer)
			}
		}
	})
}

//----- MESSAGING -----//

func wsHandler(conn *redis.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//upgrades get request to a websocket connection

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}

		defer conn.Close()

		clients[conn] = true

		for {
			var msg Message

			err := conn.ReadJSON(&msg)

			if err != nil {
				fmt.Println(err)
				delete(clients, conn)
				break
			}

			broadcast <- msg
		}
	})
}

func wsMessages() {
	for {
		msg := <-broadcast

		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println(err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

// Other potential 'feedback' routes:
// get all feedback questions
// get all feedback answers to a particular question
// get all feedback answers to a particular question on particular day
// post feedback questions

type QuestionWOptions struct {
	QId     uint
	QType   string
	QText   string
	Options []string
}

type UserAnswer struct {
	Question string
	Answer   string
}

//----- QUESTION OF THE DAY -----//

func qotdHandler(db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		param := req.URL.Query().Get("user")
		if req.Method == http.MethodGet {
			// if query string specifies a user
			// http://localhost:8080/api/qotd?user=555
			if param != "" {
				var allUserAnswers []QotdAnswer
				userAnswers := make([]UserAnswer, 10)
				userid, err := strconv.Atoi(param)
				if err != nil {
					fmt.Println(err)
				}
				db.Where("user_auth_id = ?", userid).Find(&allUserAnswers)
				numOfAnswers := len(allUserAnswers)
				if numOfAnswers < 10 {
					userAnswers = userAnswers[0:numOfAnswers]
				}
				for i, answer := range allUserAnswers {
					var question Qotd
					db.Model(&answer).Related(&question)
					userAnswers[i] = UserAnswer{question.Text, answer.Text}
				}
				q, err := json.Marshal(userAnswers)
				if err != nil {
					fmt.Println(err)
					return
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(q)
			} else {
				var randQuestionFromDb Qotd
				var questionCount int
				var answerOptionsFromDB []QotdAnswerOption
				var answerOptions []string
				db.Table("qotds").Count(&questionCount)
				db.Find(&randQuestionFromDb, rand.Intn(questionCount)+1)
				db.Model(&randQuestionFromDb).Related(&answerOptionsFromDB)
				fmt.Println(questionCount)
				fmt.Println(answerOptionsFromDB)

				for _, v := range answerOptionsFromDB {
					answerOptions = append(answerOptions, v.Text)
				}

				questionWOptions := QuestionWOptions{randQuestionFromDb.ID, randQuestionFromDb.QuestionType, randQuestionFromDb.Text, answerOptions}

				q, err := json.Marshal(questionWOptions)
				if err != nil {
					fmt.Println(err)
					return
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(q)
			}
		} else {
			var newAnswer QotdAnswer
			var user UserAuth
			var questionAnswered Qotd
			var responseString string
			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&newAnswer)
			if err != nil {
				panic(err)
			}
			db.Model(&newAnswer).Related(&questionAnswered)
			db.Model(&newAnswer).Related(&user)
			if questionAnswered.ID != 0 && user.ID != 0 {
				db.NewRecord(newAnswer)
				db.Create(&newAnswer)
				responseString = "Answer successfully posted to db"
			} else {
				responseString = "Failed to post answer. Incorrect user or question id."
			}
			w.Header().Set("Content-Type", "application/json")
			response, _ := json.Marshal(responseString)
			w.Write(response)
		}
	})
}
