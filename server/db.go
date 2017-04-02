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
}

// db.Where("name = ?", "jinzhu").Find(&UserAuth)

type UserProfile struct {
	gorm.Model
	UserAuth       UserAuth
	UserAuthID     uint   `gorm:"not null;unique"`
	Zip            string `gorm:"not null"`
	Age            int    `gorm:"not null"`
	Gender         int    `gorm:"not null"`
	Income         int
	Education      int
	Spirituality   int
	ReligiousAffil int
	Ethnicity      int
	State          string
	PoliticalAffil int
}

type Kin struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	Friend     uint `gorm:"not null"`
}

type Qotds struct {
	gorm.Model
	QuestionType string `gorm:"not null"`
	Category     string
	Text         string `gorm:"not null"`
}

type QotdsAnswerOptions struct {
	gorm.Model
	Text    string `gorm:"not null"`
	Qotds   Qotds
	QotdsID uint `gorm:"not null"`
}

type QotdsAnswers struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID uint `gorm:"not null"`
	Qotds      Qotds
	QotdsID    uint   `gorm:"not null"`
	Text       string `gorm:"not null"`
}

type SurveyQuestions struct {
	gorm.Model
	Text         string `gorm:"not null"`
	QuestionType string `gorm:"not null"`
}

type SurveyAnswers struct {
	gorm.Model
	UserAuth          UserAuth
	UserAuthID        uint `gorm:"not null"`
	SurveyQuestions   SurveyQuestions
	SurveyQuestionsID uint `gorm:"not null"`
}
