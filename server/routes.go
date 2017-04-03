package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
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

		tokenString, err := token.SignedString(mySigningKey)
		w.Header().Set("Content-Type", "application/json")
		j, _ := json.Marshal(tokenString)
		w.Write(j)
	}
}

func survey(w http.ResponseWriter, req *http.Request) {
	var us UserSurvey
	var un UserAuth
	var usp UserProfile

	decoder := json.NewDecoder(req.Body)
	defer req.Body.Close()
	err := decoder.Decode(&us)
	if err != nil {
		panic(err)
	}

	//handle post
	if req.Method == http.MethodPost {
		//if user doesn't exist in user_profiles, create new record
		db.Where(&UserAuth{Username: us.Username}).First(&un)
		if un.Username != "" {
			db.Where(&UserProfile{UserAuthID: un.ID}).First(&usp)
			if usp.UserAuthID == 0 {
				f := defaultSurvey(us)

				db.NewRecord(f)
				db.Create(&f)
			}
		}

		// if already exists
	}
}
