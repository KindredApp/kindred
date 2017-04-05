package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type UserAuth struct {
	gorm.Model        // auto creates ID, CreatedAt, UpdatedAt, DeletedAt
	Username   string `gorm:"not null;unique"`
	Name       string `gorm:"not null"`
	Email      string `gorm:"not null"`
	Password   string `gorm:"not null"`
	Token      string `gorm:"not null"`
	// QotdAnswers []QotdAnswer
	// FeedbackAnswers []FeedbackAnswer
	// Kinships []Kinship
	// Messages []Message
	// Chats    []Chat
}

type UserProfile struct {
	gorm.Model
	UserAuth       UserAuth
	UserAuthID     uint
	Zip            string `gorm:"not null"`
	Age            int    `gorm:"not null"`
	Gender         int    `gorm:"not null"`
	Income         int
	Education      int
	Religiousity   int
	Religion       int
	Ethnicity      int
	State          string
	PoliticalAffil int
}

type Qotd struct {
	gorm.Model
	QuestionType string `gorm:"not null"`
	Category     string
	Text         string `gorm:"not null"`
	// QotdAnswerOptions []QotdAnswerOption
	// QotdAnswers       []QotdAnswer
}

type QotdAnswerOption struct {
	gorm.Model
	Text   string `gorm:"not null"`
	Qotd   Qotd
	QotdID uint `gorm:"not null"`
}

type QotdAnswer struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	Qotd       Qotd
	QotdID     uint   `gorm:"not null"`
	Text       string `gorm:"not null"`
}

type FeedbackQuestion struct {
	gorm.Model
	Text         string `gorm:"not null"`
	QuestionType string `gorm:"not null"`
	// FeedbackAnswers []FeedbackAnswer
}

type FeedbackAnswer struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	// FeedbackQuestion   FeedbackQuestion
	FeedbackQuestionID uint   `gorm:"not null"`
	Answer             string `gorm:"not null"`
}

type ZipData struct {
	gorm.Model
	MedianAge      int
	AverageIncome  int
	Education      int
	Religiousity   int
	Religion       int
	Ethnicity      int
	State          string
	PoliticalAffil int
}

type Kinship struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	Friend     uint `gorm:"not null"`
	// Messages   []Message
}

// type Message struct {
// 	gorm.Model
// 	UserAuth   UserAuth
// 	UserAuthID uint `gorm:"not null"`
// 	Text       string
// }

type Chat struct {
	gorm.Model
	ChatDate   string `gorm:"not null"`
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	PairId     uint `gorm:"not null"`
}
