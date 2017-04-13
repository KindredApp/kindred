package main

import (
	"encoding/json"
	"fmt"
	"github.com/Pallinder/go-randomdata"
	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix.v2/redis"
	"golang.org/x/crypto/bcrypt"
	"math/rand"
	"strconv"
)

var questions = [11]Qotd{
	Qotd{
		QuestionType: "options",
		Category:     "personal",
		Text:         "What is your favorite decade for music?",
	},
	Qotd{
		QuestionType: "binary",
		Category:     "political",
		Text:         "Did you vote in the most recent election?",
	},
	Qotd{
		QuestionType: "likert",
		Category:     "political",
		Text:         "I think the current government is doing a good job overall.",
	},
	Qotd{
		QuestionType: "option",
		Category:     "personal",
		Text:         "Why did you sign up for kindred?",
	},
	Qotd{
		QuestionType: "binary",
		Category:     "fun",
		Text:         "Would you rather fight 100 duck-sized horses, or a single horse-sized duck?",
	},
	Qotd{
		QuestionType: "binary",
		Category:     "personal",
		Text:         "Would you rather live to 70 years old or 700?",
	},
	Qotd{
		QuestionType: "binary",
		Category:     "philosophical",
		Text:         "Are humans more like cats or dogs?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "political",
		Text:         "Who should be able to own a gun?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "social",
		Text:         "Who among these is the greatest athlete for their respective sport?",
	},
	Qotd{
		QuestionType: "binary",
		Category:     "philosophical",
		Text:         "Is there intelligent life in other parts of our galaxy or universe?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "personal",
		Text:         "where do you get the majority of your morals from?",
	},
}

var answerOptions = [48]QotdAnswerOption{
	QotdAnswerOption{
		QotdID: 1,
		Text:   "1950s",
	},
	QotdAnswerOption{
		QotdID: 1,
		Text:   "1960s",
	},
	QotdAnswerOption{
		QotdID: 1,
		Text:   "1970s",
	},
	QotdAnswerOption{
		QotdID: 1,
		Text:   "1980s",
	},
	QotdAnswerOption{
		QotdID: 1,
		Text:   "1990s",
	},
	QotdAnswerOption{
		QotdID: 1,
		Text:   "2000s",
	},
	QotdAnswerOption{
		QotdID: 1,
		Text:   "2010s",
	},
	QotdAnswerOption{
		QotdID: 2,
		Text:   "Yes",
	},
	QotdAnswerOption{
		QotdID: 2,
		Text:   "No",
	},
	QotdAnswerOption{
		QotdID: 3,
		Text:   "Strongly Agree",
	},
	QotdAnswerOption{
		QotdID: 3,
		Text:   "Agree",
	},
	QotdAnswerOption{
		QotdID: 3,
		Text:   "Neither agree nor disagree",
	},
	QotdAnswerOption{
		QotdID: 3,
		Text:   "Disagree",
	},
	QotdAnswerOption{
		QotdID: 3,
		Text:   "Strongly disagree",
	},
	QotdAnswerOption{
		QotdID: 4,
		Text:   "I wanted to meet people that were different from me",
	},
	QotdAnswerOption{
		QotdID: 4,
		Text:   "I wanted to talk about politics with people on the other side of the aisle",
	},
	QotdAnswerOption{
		QotdID: 4,
		Text:   "I enjoy talking to new people",
	},
	QotdAnswerOption{
		QotdID: 4,
		Text:   "Several of these answers",
	},
	QotdAnswerOption{
		QotdID: 4,
		Text:   "None of these answers",
	},
	QotdAnswerOption{
		QotdID: 5,
		Text:   "I prefer to fight 100 duck sized horses",
	},
	QotdAnswerOption{
		QotdID: 5,
		Text:   "I prefer to one horse sized ducks",
	},
	QotdAnswerOption{
		QotdID: 6,
		Text:   "70",
	},
	QotdAnswerOption{
		QotdID: 6,
		Text:   "700",
	},
	QotdAnswerOption{
		QotdID: 7,
		Text:   "cats",
	},
	QotdAnswerOption{
		QotdID: 7,
		Text:   "dogs",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "Any adult citizen",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "Any adult citizen with no significant mental health problems",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "Any adult citizen that undergoes and passes a gun safety course",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "Any adult citizen, but there should be background checks and safety courses prior to them purchasing one",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "Most adult citizens, excepting individual groups like serial convicts or suspected terrorists",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "Only if the citizen has undergone extensive gun training",
	},
	QotdAnswerOption{
		QotdID: 8,
		Text:   "No one should be able to own guns",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Lebron James - Basketball",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Michael Phelps - Swimming",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Serena Williams - Tennis",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Simone Biles - Gymnastics",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Christiano Ronaldo - Soccer",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Payton Manning - American Football",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Usain Bolt - Track",
	},
	QotdAnswerOption{
		QotdID: 9,
		Text:   "Ronda Rousey - Mixed martial arts",
	},
	QotdAnswerOption{
		QotdID: 10,
		Text:   "I think so",
	},
	QotdAnswerOption{
		QotdID: 10,
		Text:   "No way",
	},
	QotdAnswerOption{
		QotdID: 11,
		Text:   "My family",
	},
	QotdAnswerOption{
		QotdID: 11,
		Text:   "My religion",
	},
	QotdAnswerOption{
		QotdID: 11,
		Text:   "My friends",
	},
	QotdAnswerOption{
		QotdID: 11,
		Text:   "My own life experiences",
	},
	QotdAnswerOption{
		QotdID: 11,
		Text:   "My morals come from many places",
	},
	QotdAnswerOption{
		QotdID: 11,
		Text:   "Other",
	},
}

func seedQotds(db *gorm.DB) {
	if db.HasTable(&Qotd{}) {
		db.DropTable(&Qotd{})
	}
	if db.HasTable(&QotdAnswerOption{}) {
		db.DropTable(&QotdAnswerOption{})
	}
	db.CreateTable(&Qotd{})
	db.CreateTable(&QotdAnswerOption{})

	for _, question := range questions {
		db.NewRecord(question)
		db.Create(&question)
	}
	for _, option := range answerOptions {
		db.NewRecord(option)
		db.Create(&option)
	}
}

func seedUsers(db *gorm.DB, conn *redis.Client, numFakeUsers int) {
	seedUserAuth(db, numFakeUsers)
	seedUserProfiles(db, conn, numFakeUsers)
	seedUserAnswers(db, numFakeUsers)
}

func seedUserAuth(db *gorm.DB, numUsers int) {
	if db.HasTable(&UserAuth{}) {
		db.DropTable(&UserAuth{})
	}
	db.CreateTable(&UserAuth{})
	for i := 1; i <= numUsers; i++ {
		var user UserAuth
		fakeVal := "tester"
		fakeVal += strconv.Itoa(i)
		user.Username = fakeVal
		user.Name = fakeVal
		bs, err := bcrypt.GenerateFromPassword([]byte(fakeVal), bcrypt.MinCost)
		if err != nil {
			fmt.Println("error encrypting fake user password")
		}
		user.Password = string(bs)
		fakeVal += "@emailsvc.com"
		user.Email = fakeVal
		db.NewRecord(user)
		db.Create(&user)
	}
}

func seedUserProfiles(db *gorm.DB, conn *redis.Client, numUsers int) {
	if db.HasTable(&UserProfile{}) {
		db.DropTable(&UserProfile{})
	}
	db.CreateTable(&UserProfile{})
	for i := 1; i <= numUsers; i++ {
		var profile UserProfile
		profile.UserAuthID = uint(i)
		profile.Age = rand.Intn(51) + 15
		profile.Gender = rand.Intn(3) + 1
		profile.Income = rand.Intn(8) + 1
		// Not real zips, just the right format
		profile.Zip = randomdata.PostalCode("SE")
		profile.State = randomdata.State(randomdata.Small)
		profile.Education = rand.Intn(10) + 1
		profile.Religiousity = rand.Intn(10) + 1
		profile.Religion = rand.Intn(9) + 1
		profile.Ethnicity = rand.Intn(7) + 1
		profile.Party = rand.Intn(6) + 1

		// Mark survey as complete in Redis cache
		var user UserAuth
		db.First(&user, profile.UserAuthID)
		out, err := json.Marshal(user)
		if err != nil {
			panic(err)
		}
		conn.Cmd("HMSET", user.Username, "Profile", string(out), "Survey", "true")

		// Add to profile to database
		db.NewRecord(profile)
		db.Create(&profile)
	}
}

func seedUserAnswers(db *gorm.DB, numUsers int) {
	if db.HasTable(&QotdAnswer{}) {
		db.DropTable(&QotdAnswer{})
	}
	db.CreateTable(&QotdAnswer{})
	var numQotds int
	db.Model(&Qotd{}).Count(&numQotds)
	for i := 1; i <= numQotds; i++ {
		var options []QotdAnswerOption
		db.Where(&QotdAnswerOption{QotdID: uint(i)}).Find(&options)
		numOptions := len(options)
		for j := 1; j <= numUsers; j++ {
			var answer QotdAnswer
			answer.QotdID = uint(i)
			answer.UserAuthID = uint(j)
			answer.Text = options[rand.Intn(numOptions)].Text
			db.NewRecord(answer)
			db.Create(&answer)
		}
	}
}
