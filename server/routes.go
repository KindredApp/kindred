package main

import (
	"net/http"
	"log"
	"encoding/json"
	"time"
	"golang.org/x/crypto/bcrypt"
	"github.com/dgrijalva/jwt-go"
)



//remove once db is created
var dbUsers = map[string]userBcrypt{}

func init() {
	bs, _ := bcrypt.GenerateFromPassword([]byte("password1234"), bcrypt.MinCost)
	dbUsers["j-s-o"] = userBcrypt{"j-s-o", "jonathan so", "jso.jonathan@gmail.com", bs}
}

//-----

func signup(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var u user
	var ub userBcrypt
	defer req.Body.Close()

	err := decoder.Decode(&u)
	if err != nil {
		panic(err)
	}

	bs, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	ub = userBcrypt{u.Username, u.Name, u.Email, bs}

	//store userbcrypt details in database
	log.Println("User Bcrypt to store is", ub)
}

func login(w http.ResponseWriter, req *http.Request) {

	if req.Method == http.MethodPost {
		// implement JSON web token to see if user is already logged in 
		
		decoder := json.NewDecoder(req.Body)
		var u user
		defer req.Body.Close()
		err := decoder.Decode(&u)
		if err != nil {
			panic(err)
		}

		_, ok := dbUsers[u.Username]
		if !ok {
			http.Error(w, "Username and/or password does not match", http.StatusForbidden)
		}

		err = bcrypt.CompareHashAndPassword(dbUsers[u.Username].Password, []byte(u.Password))
		if err != nil {
			panic(err)
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"Username": u.Username,
			"Time": time.Now().Add(time.Hour * 72).Unix(),
		})
		tokenString, err := token.SignedString(mySigningKey)
		w.Header().Set("Content-Type", "application/json")
		j, _ := json.Marshal(tokenString)
		w.Write(j)
	}
}

func protected(w http.ResponseWriter, req *http.Request) {
  log.Println("Protected resource served")
}