package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type UserAuth struct {
	gorm.Model // auto creates ID, CreatedAt, UpdatedAt, DeletedAt
	username   string
	name       string
	email      string
	password   string
}

// db.Where("name = ?", "jinzhu").Find(&UserAuth)

type UserProfile struct {
	gorm.Model
	UserAuth   UserAuth
	UserAuthID int
	zip        string
	age        int
	education  string
	kin        []UserAuth `gorm:"many2many:user_kin;"`
}

// db.Create(&Product{Code: "L1212", Price: 1000})
