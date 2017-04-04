package main

import (
	"fmt"
	"github.com/auth0/go-jwt-middleware"
	"github.com/codegangsta/negroni"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
)

type User struct {
	Username string
	Name     string
	Email    string
	Password string
}

type UserBcrypt struct {
	Username string
	Name     string
	Email    string
	Password []byte
}

type UserSurvey struct {
	Username       string
	Zip            string
	Age            int
	Gender         int
	Ethnicity      int
	Income         int
	Education      int
	Religiousity   int
	Religion       int
	State          string
	PoliticalAffil int
}

var db *gorm.DB
var err error

func main() {
	// Set environment variable(s)- remove key BEFORE committing!!

	// os.Setenv("JWT_AUTH_KEY", "!! REPLACE WITH SECRET KEY !!")
	// fmt.Println(os.Getenv("JWT_AUTH_KEY"))

	//db
	dbinfo := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
	db, err = gorm.Open("postgres", dbinfo)
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&UserAuth{}, &UserProfile{}, &Qotd{}, &QotdAnswerOption{}, &QotdAnswer{}, &FeedbackQuestion{}, &FeedbackAnswer{}, &Kinship{}, &Chat{})

	defer db.Close()

	//server
	r := http.NewServeMux()

	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(mySigningKey), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	r.Handle("/api/profile", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(profile))))

	http.Handle("/", http.FileServer(http.Dir("../public/")))
	http.Handle("/bundles/", http.StripPrefix("/bundles/", http.FileServer(http.Dir("../bundles/"))))
	http.HandleFunc("/api/login", login)
	http.HandleFunc("/api/signup", signup)
	http.Handle("/api/profile", r)
	http.HandleFunc("/api/feedback", feedback)
	// http.Handle("/api/kinships", kinships)
	http.Handle("/favicon.ico", http.NotFoundHandler())
	http.ListenAndServe(":8080", nil)

}

//redirects
//http.Redirect(w, req, "/", http.MovedPermanently, http.StatusSeeOther, or http.StatusTemporaryRedirect)
//lower level
//w.Header().Set("Location", "/")
//w.WriteHeader(http.StatusSeeOther)

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
