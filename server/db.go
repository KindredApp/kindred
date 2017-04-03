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
}

// db.Where("name = ?", "jinzhu").Find(&UserAuth)

type UserProfile struct {
	gorm.Model
	UserAuth       UserAuth
	UserAuthID     uint   `gorm:"AUTO_INCREMENT"`
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
}

type FeedbackAnswer struct {
	gorm.Model
	UserAuth           UserAuth
	UserAuthID         uint `gorm:"not null"`
	FeedbackQuestion   FeedbackQuestion
	FeedbackQuestionID uint `gorm:"not null"`
}

type ZipData struct {
	gorm.Model
	MedianAge      int // if age not given, use median age
	AverageIncome  int // if income not given use average income
	Education      int // if education not given, use most common education
	Religiousity   int // if religion not given, pair randomly
	Religion       int // don't assign (if pick most common and the person is not most, common)
	Ethnicity      int // if Ethnicity
	State          string
	PoliticalAffil int
}

type Kinship struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	Friend     uint `gorm:"not null"`
}

type Chat struct {
	gorm.Model
	ChatDate   string `gorm:"not null"`
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	PairId     uint `gorm:"not null"`
}
