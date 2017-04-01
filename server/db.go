package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type UserAuth struct {
	gorm.Model // auto creates ID, CreatedAt, UpdatedAt, DeletedAt
	Username   string
	Name       string
	Email      string
	Password   string
}

// db.Where("name = ?", "jinzhu").Find(&UserAuth)

type UserProfile struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID int
	Zip        string
	Age        int
	Education  string
	Kin        []UserAuth `gorm:"many2many:user_kin;"`
}

// db.Create(&Product{Code: "L1212", Price: 1000})
