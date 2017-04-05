package main

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"log"
	"math/rand"
	"net/http"
	"time"
)

//-----

func signup(w http.ResponseWriter, req *http.Request) {
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

	w.Header().Set("Content-Type", "application/json")
	j, _ := json.Marshal("User created")
	w.Write(j)
	return
}

func login(w http.ResponseWriter, req *http.Request) {

	if req.Method == http.MethodPost {
		// still need to implement JSON web token to see if user is already logged in
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
		rj := j[1:len(j)-1]
		db.Where("user_auth_id = ?", un.ID).First(&usp)
		out, err := json.Marshal(usp)
		if err != nil {
			panic(err)
		}

		conn.Cmd("HMSET", u.Username, "Token", rj, "Name", un.Name, "Profile", string(out))


		//send token back as response
		w.Write(j)
	}
}

func profile(w http.ResponseWriter, req *http.Request) {
	var us UserSurvey
	var un UserAuth
	var usp UserProfile
	rh := req.Header.Get("Authorization")[7:]

	decoder := json.NewDecoder(req.Body)
	defer req.Body.Close()
	err := decoder.Decode(&us)
	log.Println("User profile is", us)
	if err != nil {
		panic(err)
	}
	//handle post
	if req.Method == http.MethodPost {
		//query for user in UserAuth based on token
		db.Where(&UserAuth{Token: "\"" + rh + "\""}).First(&un)
		//set UserSurvey struct ID to their ID in user auth;
		us.ID = un.ID
		//query UserPRofile table to see if a profile entry exists for them
		db.Where("user_auth_id = ?", un.ID).First(&usp)
		if usp.UserAuthID == 0 {
			f := defaultSurvey(us)

			db.NewRecord(f)
			db.Create(&f)

			w.Header().Set("Content-Type", "application/json")
			j, _ := json.Marshal("Profile posted")
			w.Write(j)
		} else {
			f := defaultSurvey(us)
			db.Model(&usp).Updates(f)
		}
	}
}

func feedback(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodGet {
		var randQuestion FeedbackQuestion
		var questionCount int
		db.Table("feedback_questions").Count(&questionCount)
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
			db.Create(&newAnswer)
		}
	}
}

func wsConnections(w http.ResponseWriter, r *http.Request) {
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
}

func wsMessages() {
	for {
		msg := <- broadcast

		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println(err);
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
