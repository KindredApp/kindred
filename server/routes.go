package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
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

// // mockversion
// func addKin() {
// 	var kin1 UserAuth
// 	var kin2 UserAuth
// 	var kinship Kinship
// 	var kinshipInverse Kinship

// 	mockKin1Username := "nzey"
// 	mockKin2UserName := "jso"

// 	db.Where("Username = ?", mockKin1Username).First(&kin1)
// 	db.Where("Username = ?", mockKin2UserName).First(&kin2)

// 	kinship.UserAuthID = kin1.ID
// 	kinship.Friend = kin2.ID
// 	db.NewRecord(kinship)
// 	// TODO: Add condition - only create if kinship doesn't already exists
// 	kinshipInverse.UserAuthID = kin2.ID
// 	kinshipInverse.Friend = kin1.ID
// 	db.NewRecord(kinshipInverse)
// 	db.Create(&kinship)
// 	db.Create(&kinshipInverse)
// }

// Real version
func kinships(w http.ResponseWriter, req *http.Request) {

	type KinshipToAdd struct {
		user1 string //int in string format
		user2 string
	}

	var kinshipRequest KinshipToAdd
	var kin1 UserAuth
	var kin2 UserAuth
	var kinship Kinship
	var kinshipInverse Kinship

	decoder := json.NewDecoder(req.Body)
	defer req.Body.Close()
	err := decoder.Decode(&kinshipRequest)
	if err != nil {
		panic(err)
	}

	//handle post
	if req.Method == http.MethodPost {
		// TODO: handle errors/not-founds
		user1_id := db.First(&user_auth, strconv.Atoi(kinshipRequest.user1)).ID
		user2_id := db.First(&user_auth, strconv.Atoi(kinshipRequest.user2)).ID
		kinship.UserAuthID = user1_id
		kinship.Friend = user2_id

		db.NewRecord(kinship)

		if db.Find(&UserAuth{UserAuthID: user1_id, Friend: user2_id}) == nil {
			kinshipInverse.UserAuthID = user2_id
			kinshipInverse.Friend = user1_id
			db.NewRecord(kinshipInverse)
			db.Create(&kinship)
			db.Create(&kinshipInverse)
		}
	} else {
		// handle get
		// NOTE: sending back chat date and topic - will require additional schema of who are person has chatted with
		type Kin struct {
			Id       int
			Username string
			Name     string
		}

		var kinList []Kin

		if req.Method == http.MethodGet {
			db.Find(&Kinship{UserAuthID: user1_id})
			// for each row found, save as a Kin type and add to kinList
			db.NewRecord(kinList)
			db.Create(&kinList)
		}
	}
}

// func addZip() {
// 	var unprocessedZipData RawZipData
// 	var zipRow ZipData
// 	mockZip := "94702"
// 	safeZip := url.QueryEscape(mockZip)

// 	url := fmt.Sprintf("https://azure.geodataservice.net/GeoDataService.svc/GetUSDemographics?$format=json&zipcode=%s", safeZip)

// 	req, err := http.NewRequest("GET", url, nil)
// 	if err != nil {
// 		log.Fatal("NewRequest: ", err)
// 		return
// 	}

// 	client := &http.Client{}

// 	resp, err := client.Do(req)
// 	if err != nil {
// 		log.Fatal("Do: ", err)
// 		return
// 	}

// 	defer resp.Body.Close()

// 	if err := json.NewDecoder(resp.Body).Decode(&unprocessedZipData); err != nil {
// 		log.Println(err)
// 	}

// 	db.NewRecord(zipRow)
// 	db.Create(&zipRow)
// }
