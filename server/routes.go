package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/mediocregopher/radix.v2/pool"
	"golang.org/x/crypto/bcrypt"
)

//----- SIGNUP -----//

func signupHandler(db *gorm.DB, p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}
		var u User
		var un UserAuth

		decoder := json.NewDecoder(req.Body)
		defer req.Body.Close()
		err = decoder.Decode(&u)
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

func loginHandler(db *gorm.DB, p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

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

func logoutHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

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
func tokenHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

		var c Cookie
		var b bool

		decoder := json.NewDecoder(req.Body)
		defer req.Body.Close()
		err = decoder.Decode(&c)
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

func visitHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

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

func profileHandler(db *gorm.DB, p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

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
			db.Model(&un).Related(&usp)

			//create new user profile entry
			if usp.UserAuthID == 0 {
				f := defaultSurvey(us)
				//create new database record
				db.NewRecord(f)
				db.Create(&f)
				//add profile to cache
				out, err := json.Marshal(f)
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
				out, err := json.Marshal(f)
				if err != nil {
					panic(err)
				}

				conn.Cmd("HMSET", un.Username, "Profile", string(out), "Survey", "true")

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

		// delete user profile
		if req.Method == http.MethodDelete {
			///api/profile?user=username
			type UserID struct {
				ID int
			}
			var userID UserID
			var userProfile UserProfile
			var userAuth UserAuth
			var userKinship Kinship
			var r string
			username := req.URL.Query().Get("user")
			db.Table("user_auths").Select("id").Where("username = ?", username).Scan(&userID)
			db.Raw("SELECT * FROM user_auths WHERE id = ?", userID.ID).Scan(&userAuth)
			db.Raw("SELECT * FROM user_profiles WHERE user_auth_id = ?", userID.ID).Scan(&userProfile)
			db.Raw("SELECT * FROM kinships WHERE user_auth_id = ?", userID.ID).Scan(&userKinship)
			if userProfile.UserAuthID != 0 {
				db.Delete(&userProfile)
				db.Delete(&userAuth)
				db.Delete(&userKinship)
				r = "Profile deleted"
			} else {
				r = "User does not exist"
			}
			res, err := json.Marshal(r)
			if err != nil {
				panic(err)
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
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

// ----- QUEUE ------ //

func queueRemoveHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

		if req.Method == http.MethodPost {
			var p UserQueue
			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&p)
			if err != nil {
				panic(err)
			}

			log.Println("post to queue from queue remove is:", p)

			out, err := json.Marshal(p)
			if err != nil {
				panic(err)
			}

			conn.Cmd("LREM", "queue", "-1", string(out))
			w.Write(out)
		}
	})
}

func queueHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

		if req.Method == http.MethodGet {

			qr, _ := conn.Cmd("LPOP", "queue").Str()
			log.Printf("qr is: v - %v, t - %T", qr, qr)
			if qr == "" {
				log.Println("handling empty queue")
				j, err := json.Marshal("empty")
				if err != nil {
					panic(err)
				}
				w.Write(j)
			} else {
				j, err := json.Marshal(qr)
				if err != nil {
					panic(err)
				}

				w.Header().Set("Content-Type", "application/json")
				w.Write(j)
			}
			// if err != nil {
			// 	panic(err)
			// }

			// var s string
			// ql, err := conn.Cmd("LLEN", "queue").Int()
			// qr, err := conn.Cmd("L`RA`NGE", "queue", 0, ql).Array()
			// if err != nil {
			// 	panic(err)
			// }

			// for _, v := range qr {
			// 	tempS, _ := v.Str()
			// 	s += tempS + " "
			// }

			// j, err := json.Marshal(s)
			// if err != nil {
			// 	panic(err)
			// }

			// w.Header().Set("Content-Type", "application/json")
			// w.Write(j)
		}
		if req.Method == http.MethodPost {
			var p UserQueue
			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&p)
			if err != nil {
				panic(err)
			}

			log.Println("post to queue is from queue handler is:", p)

			out, err := json.Marshal(p)
			if err != nil {
				panic(err)
			}

			conn.Cmd("RPUSH", "queue", string(out))
			w.Write(out)
		}

	})
}

// ----- Room ------ //

func roomRemoveHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

		if req.Method == http.MethodPost {
			var r Room
			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&r)
			if err != nil {
				panic(err)
			}

			log.Println("room remove is", r)

			out, err := json.Marshal(r)
			if err != nil {
				panic(err)
			}

			log.Println("remove remove out is", string(out))

			conn.Cmd("LREM", "rooms", "-1", string(out))
			w.Write(out)
		}
	})
}

func roomHandler(p *pool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

		if req.Method == http.MethodGet {
			var s string
			rl, err := conn.Cmd("LLEN", "rooms").Int()
			r, err := conn.Cmd("LRANGE", "rooms", 0, rl).Array()

			if err != nil {
				panic(err)
			}

			for _, v := range r {
				tempS, _ := v.Str()
				s += tempS + " "
			}

			j, err := json.Marshal(s)
			if err != nil {
				panic(err)
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(j)
		}

		if req.Method == http.MethodPost {
			var r Room
			decoder := json.NewDecoder(req.Body)
			defer req.Body.Close()
			err := decoder.Decode(&r)
			if err != nil {
				panic(err)
			}

			rc, err := conn.Cmd("GET", "roomCount").Int()
			log.Println("roomCount is:", rc)
			if err != nil {
				panic(err)
			}
			r.RoomNumber = rc + 1

			out, err := json.Marshal(r)
			if err != nil {
				panic(err)
			}

			conn.Cmd("RPUSH", "rooms", string(out))
			conn.Cmd("INCR", "roomCount")

			w.Write(out)
		}
	})
}

//----- MESSAGING -----//

// func wsHandler(p *pool.Pool) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		conn, err := p.Get()
// 		defer p.Put(conn)
// 		if err != nil {
// 			panic(err)
// 		}

// 		//upgrades get request to a websocket connection

// 		conn, err = upgrader.Upgrade(w, r, nil)
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		// defer conn.Close()

// 		clients[conn] = true

// 		for {
// 			var msg Message

// 			err := conn.ReadJSON(&msg)

// 			if err != nil {
// 				fmt.Println(err)
// 				delete(clients, conn)
// 				break
// 			}

// 			broadcast <- msg
// 		}
// 	})
// }

// func wsMessages() {
// 	for {
// 		msg := <-broadcast

// 		for client := range clients {
// 			err := client.WriteJSON(msg)
// 			if err != nil {
// 				fmt.Println(err)
// 				client.Close()
// 				delete(clients, client)
// 			}
// 		}
// 	}
// }

// Other potential 'feedback' routes:
// get all feedback questions
// get all feedback answers to a particular question
// get all feedback answers to a particular question on particular day
// post feedback questions

type UserAnswer struct {
	Question string
	Answer   string
}

//----- QUESTION OF THE DAY -----//

func qotdHandler(db *gorm.DB, p *pool.Pool, qotdCounter *int) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		conn, err := p.Get()
		defer p.Put(conn)
		if err != nil {
			panic(err)
		}

		param := req.URL.Query().Get("user")
		if req.Method == http.MethodGet {
			// if query string specifies a user
			// api/qotd?user=555
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
			} else if req.URL.Query().Get("q") == "data" {
				// if query string requests the data from the last 10 QOTDs, for data map etc
				// api/qotd?q=data
				type QotdData struct {
					QotdID       int
					QotdType     string
					QotdCategory string
					QotdText     string
					UserAuthID   int
					AnswerText   string
					Zip          int
					Age          int
					Gender       int
					Income       int
					Education    int
					Religiousity int
					Ethnicity    int
					State        string
					Party        int
				}

				var qotdData []QotdData

				db.Raw("SELECT qotds.id as qotd_id, qotds.question_type AS qotd_type, qotds.category AS qotd_category, qotds.text AS qotd_text, qotd_answers.user_auth_id, qotd_answers.text AS answer_text, user_profiles.zip, user_profiles.age, user_profiles.gender, user_profiles.income, user_profiles.education, user_profiles.religiousity, user_profiles.religion, user_profiles.ethnicity, user_profiles.state, user_profiles.party FROM qotds, qotd_answer_options, qotd_answers, user_profiles WHERE qotds.id = qotd_answer_options.qotd_id AND qotds.id = qotd_answers.qotd_id AND qotd_answer_options.text = qotd_answers.text AND qotd_answers.user_auth_id = user_profiles.user_auth_id AND qotds.id <=? AND qotds.id >=?", qotdCounter, *qotdCounter-9).Scan(&qotdData)

				data, err := json.Marshal(qotdData)
				if err != nil {
					panic(err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(data)
			} else if req.URL.Query().Get("q") == "dataoptions" {
				// get answer options for qotd data for map
				// api/qotd?q=dataoptions
				type QotdAnswers struct {
					QotdID     int
					QotdText   string
					AnswerText string
				}
				var qotdAnswerOptions []QotdAnswers
				// db.Raw("SELECT * FROM qotd_answer_options WHERE qotd_id <=? AND qotd_id >= ?", qotdCounter, *qotdCounter-9).Scan(&qotdAnswerOptions)

				db.Raw("SELECT qotds.text AS qotd_text, qotds.ID AS qotd_id, qotd_answer_options.text AS answer_text FROM qotds, qotd_answer_options WHERE qotds.id = qotd_answer_options.qotd_id AND qotd_id <=? AND qotd_id >=?", qotdCounter, *qotdCounter-9).Scan(&qotdAnswerOptions)

				data, err := json.Marshal(qotdAnswerOptions)
				if err != nil {
					panic(err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(data)
			} else if req.URL.Query().Get("q") == "qotd" {
				// if query string requests the current qotd
				// api/qotd?q=qotd
				type QuestionWOptions struct {
					ID       string
					Qtype    string
					Category string
					Text     string
					Options  []string
				}
				var qotdWOptions QuestionWOptions
				qotd, err := conn.Cmd("HGETALL", "qotd").Map()
				options, err := conn.Cmd("HGETALL", "options").List()
				qotdWOptions.ID = qotd["id"]
				qotdWOptions.Qtype = qotd["qtype"]
				qotdWOptions.Text = qotd["text"]
				qotdWOptions.Category = qotd["category"]
				for i := 1; i < len(options); i += 2 {
					qotdWOptions.Options = append(qotdWOptions.Options, options[i])
				}
				data, err := json.Marshal(qotdWOptions)
				if err != nil {
					panic(err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(data)
			}
		} else {
			// post user qotd answer to db
			var newAnswer QotdAnswer
			var oldAnswer QotdAnswer
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
				db.Where(&QotdAnswer{UserAuthID: user.ID, QotdID: questionAnswered.ID}).First(&oldAnswer)
				if &oldAnswer == nil {
					db.NewRecord(newAnswer)
					db.Create(&newAnswer)
				} else {
					db.Model(&oldAnswer).Update("text", newAnswer.Text)
				}
				responseString = "Answer successfully posted or updated in db"
			} else {
				responseString = "Failed to post answer. Incorrect user or question id."
			}
			w.Header().Set("Content-Type", "application/json")
			response, _ := json.Marshal(responseString)
			w.Write(response)
		}
	})
}

//----- TWILIO REVERSE PROXY ------//

func twilioProxy(w http.ResponseWriter, r *http.Request) {
	log.Println("receiving twilio request from client")
	r.Host = "localhost:3000"

	j := strings.Join(r.URL.Query()["q"], "")
	u, _ := url.Parse("http://localhost:300/api/twilio" + j)
	proxy := httputil.NewSingleHostReverseProxy(u)

	proxy.Transport = &transport{CapturedTransport: http.DefaultTransport}
	proxy.ServeHTTP(w, r)
}

type transport struct {
	CapturedTransport http.RoundTripper
}

func (t *transport) RoundTrip(request *http.Request) (*http.Response, error) {
	// response, err := http.DefaultTransport.RoundTrip(request)
	response, err := t.CapturedTransport.RoundTrip(request)
	bodyBytes, err := ioutil.ReadAll(response.Body)

	// body, err := httputil.DumpResponse(response, true)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()
	response.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

	log.Println("proxy reponse is", response)

	return response, err
}
