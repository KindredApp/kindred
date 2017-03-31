package main

import (
	"net/http"
	"log"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	// "github.com/dgrijalva/jwt-go"
	// "github.com/jinzhu/gorm"
// _ "github.com/jinzhu/gorm/dialects/sqlite"
)

type user struct {
	Username string
	Name string
	Email string
	Password string
}

type userBcrypt struct {
	Username string
	Name string
	Email string
	Password []byte
}

//remove once db is created
var dbUsers = map[string]userBcrypt{}

func init() {
	bs, _ := bcrypt.GenerateFromPassword([]byte("password1234"), bcrypt.MinCost)
	dbUsers["j-s-o"] = userBcrypt{"j-s-o", "jonathan so", "jso.jonathan@gmail.com", bs}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("../public/")))
	http.Handle("/bundles/", http.StripPrefix("/bundles/", http.FileServer(http.Dir("../bundles/"))))
	http.HandleFunc("/login", login)
	http.HandleFunc("/signup", signup)
	http.Handle("/favicon.ico", http.NotFoundHandler())
	http.ListenAndServe(":8080", nil)
}

func signup(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var u user
	var ub userBcrypt
	
	defer req.Body.Close()

	err := decoder.Decode(&u)
	if err != nil {
		panic(err)
	}

	//check if username is taken

	//encrypt password
	bs, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	ub = userBcrypt{u.Username, u.Name, u.Email, bs}

	//store userbcrypt details in database

	//redirect 
	log.Println(ub)
	// http.Redirect(w, req, "/", http.StatusSeeOther)
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
		log.Println(u)

		// see if username exists in table
		_, ok := dbUsers[u.Username]
		if !ok {
			http.Error(w, "Username and/or password does not match", http.StatusForbidden)
		}

		// see if password matches
		err = bcrypt.CompareHashAndPassword(dbUsers[u.Username].Password, []byte(u.Password))

		if err != nil {
			panic(err)
		}

		defer req.Body.Close()
		log.Println("Successful login")
	}

}

//redirects
//http.Redirect(w, req, "/", http.MovedPermanently, http.StatusSeeOther, or http.StatusTemporaryRedirect)
//lower level
//w.Header().Set("Location", "/")
//w.WriteHeader(http.StatusSeeOther)

//cookies
//set cookie - http.SetCookie(responseWriter, *cookie)
//pointer to cookie -> &http.Cookie{ Name: "my-cookie", Value: "Some value", }
//read cookie - c, err := req.Cookie("my-cookie")

// 1) On client, ask for userName and password
// 2) Exchange the userName and password for a time-limited access token via HTTPS. Use jwt-go on the server
//     to create the token. Use bcrypt to encrypt and compare passwords.
// 3) Add the recieved access token to the request header for any RESTful API requiring authorization
// {
// 	"iss": "http://kindrechat.io",
// 	"user": "xxxxxx"
// }
// 4) On the server, add an access token checker middleware for those routes. JWT tokens have an expire (exp)
//     and not before (nbf) timestamp. JWT validates those when it parses the token from the header.
// 5) On client, periodically refresh the token. Our tokens expire in 5 minutes. I refresh them every 4 minutes.
