package main

import "os"

// Fill in the key string in place of 'os.Getenv("JWT_AUTH_KEY")
// and CHANGE BACK BEFORE COMMITTING!!!
// or set environment variable
var mySigningKey = []byte(os.Getenv("JWT_AUTH_KEY"))

const (
	DB_HOST     = "localhost"
	DB_USER     = "" // FILL THIS IN & CHANGE BACK BEFORE COMMITTING
	DB_PASSWORD = "" // FILL THIS IN & CHANGE BACK BEFORE COMMITTING
	DB_NAME     = "kindred"
)