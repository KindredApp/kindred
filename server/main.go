package main

import (
	"fmt"
	"github.com/auth0/go-jwt-middleware"
	"github.com/codegangsta/negroni"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"log"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"net/http"
	"github.com/mediocregopher/radix.v2/redis"

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

//global connection variables
var db *gorm.DB
var err error
var conn *redis.Client


func main() {
	// Set environment variable(s)- remove key BEFORE committing!!

	// os.Setenv("JWT_AUTH_KEY", "!! REPLACE WITH SECRET KEY !!")
	// fmt.Println(os.Getenv("JWT_AUTH_KEY"))

	//redis
	conn, err = redis.Dial("tcp", "localhost:6379")
	if err != nil {
		log.Panic(err)
	}
	defer conn.Close()

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