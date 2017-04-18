package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"

	"github.com/Pallinder/go-randomdata"
	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix.v2/pool"
	"golang.org/x/crypto/bcrypt"
)

//Creates questions to seed database with
var questions = [20]Qotd{
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
	Qotd{
		QuestionType: "options",
		Category:     "fun",
		Text:         "Who among these would be the last person standing in a fight to the death?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "personal",
		Text:         "If you could travel to any continent right now, which one would it be?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "personal",
		Text:         "What is your favorite genre to read?",
	},
	Qotd{
		QuestionType: "likert",
		Category:     "social",
		Text:         "How much do you agree with the following statement: 'The United States in 10 years will be a better place to live than right now.' ?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "fun",
		Text:         "Who among these would win in a rap battle?",
	},
	Qotd{
		QuestionType: "binary",
		Category:     "philosophical",
		Text:         "Are most people the same as each other or are most people different from each other?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "personal",
		Text:         "Where do you get most of your news?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "social",
		Text:         "What is your favorite sport to watch and/or play?",
	},
	Qotd{
		QuestionType: "options",
		Category:     "political",
		Text:         "If you had $200 billion dollars and had to donate it to our government for a specified use, which would you pick?",
	},
}

//Answers for each question above
var answerOptions = [105]QotdAnswerOption{
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
		Text:   "I prefer to fight one horse sized duck",
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
	QotdAnswerOption{
		QotdID: 12,
		Text:   "Jon Snow",
	},
	QotdAnswerOption{
		QotdID: 12,
		Text:   "Arnold Schwarzenegger",
	},
	QotdAnswerOption{
		QotdID: 12,
		Text:   "Buddy the Elf",
	},
	QotdAnswerOption{
		QotdID: 12,
		Text:   "Joan of Arc",
	},
	QotdAnswerOption{
		QotdID: 12,
		Text:   "Bugs Bunny",
	},
	QotdAnswerOption{
		QotdID: 12,
		Text:   "Susan B. Anthony",
	},
	QotdAnswerOption{
		QotdID: 12,
		Text:   "I think fighting is barbaric...",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "Africa",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "Asia",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "Australia",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "Europe",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "North America",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "South America",
	},
	QotdAnswerOption{
		QotdID: 13,
		Text:   "Antarctica",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Any non-fiction",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Any fiction",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Science fiction",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Romance",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Biographies",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Fantasy",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "Other",
	},
	QotdAnswerOption{
		QotdID: 14,
		Text:   "I think books are gross",
	},
	QotdAnswerOption{
		QotdID: 15,
		Text:   "Strongly disagree",
	},
	QotdAnswerOption{
		QotdID: 15,
		Text:   "Disagree",
	},
	QotdAnswerOption{
		QotdID: 15,
		Text:   "I think it will be about the same",
	},
	QotdAnswerOption{
		QotdID: 15,
		Text:   "Agree",
	},
	QotdAnswerOption{
		QotdID: 15,
		Text:   "Strongly agree",
	},
	QotdAnswerOption{
		QotdID: 16,
		Text:   "William Shakespeare",
	},
	QotdAnswerOption{
		QotdID: 16,
		Text:   "Tupac",
	},
	QotdAnswerOption{
		QotdID: 16,
		Text:   "Eminem",
	},
	QotdAnswerOption{
		QotdID: 16,
		Text:   "Missy Elliot",
	},
	QotdAnswerOption{
		QotdID: 16,
		Text:   "Edgar Allen Poe",
	},
	QotdAnswerOption{
		QotdID: 16,
		Text:   "The Notorious B.I.G.",
	},
	QotdAnswerOption{
		QotdID: 17,
		Text:   "I think most people are the same",
	},
	QotdAnswerOption{
		QotdID: 17,
		Text:   "I think most people are different",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "I don't read the news",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "Social Media(Facebook, twitter, etc)",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "Radio",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "Friends/Community",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "Local newspaper, magazine",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "A major network television channel",
	},
	QotdAnswerOption{
		QotdID: 18,
		Text:   "Other",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Basketball",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "American football",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Soccer",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Swimming",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Track & Field",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Baseball/Softball",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Hockey",
	},
	QotdAnswerOption{
		QotdID: 19,
		Text:   "Other",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Education",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Social security",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Reduce international debt",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Military",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Health care",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Building infrastructure",
	},
	QotdAnswerOption{
		QotdID: 20,
		Text:   "Other",
	},
}

//first drops all old tables for a clean slate, then inputs all questions and answers to tables
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

//meta function to seed database with fake user profile, and answers to questions
func seedUsers(db *gorm.DB, p *pool.Pool, numFakeUsers int) {
	seedUserAuth(db, numFakeUsers)
	seedUserProfiles(db, p, numFakeUsers)
	seedUserAnswers(db, numFakeUsers)
}

//creates dummy user
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

//creates demographic data for dummy users
func seedUserProfiles(db *gorm.DB, p *pool.Pool, numUsers int) {
	conn, err := p.Get()
	defer p.Put(conn)
	if err != nil {
		panic(err)
	}
	
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
		profile.State = pickRandomState()
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

//Creates dummy answers for each question for each dummy user
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
