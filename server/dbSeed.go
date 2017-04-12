package main

import (
	"github.com/jinzhu/gorm"
)

var questions = [7]Qotd{
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
}

var answerOptions = [25]QotdAnswerOption{
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
}

func seed(db *gorm.DB) {
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
