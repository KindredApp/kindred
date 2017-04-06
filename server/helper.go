package main

// structs
type User struct {
	Username string
	Name     string
	Email    string
	Password string
}

type UserBcrypt struct {
	Username string
	Name     string
	Email    string
	Password []byte
}

type UserSurvey struct {
  ID uint
	Username string
	Zip string
	Age int
	Gender int
	Ethnicity int 
	Income int
	Education int
	Religiousity int
	Religion int
	State string
	PoliticalAffil int
}

type Message struct {
  Username string `json:"username"`
  Message string `json:"message"`
}

type Cookie struct {
  Username string
  Token string
}

// type ReqObj struct {
// Username string
// }

//helper functions

func defaultSurvey(a UserSurvey) UserProfile {
  var up UserProfile

  up.UserAuthID = a.ID
  up.Age = a.Age // Mandatory
  up.Gender = a.Gender // Mandatory
  up.Ethnicity = a.Ethnicity // Mandatory
  up.Zip = a.Zip // Mandatory
  up.State = a.State // Mandatory
  up.Income = a.Income
  up.Education = a.Education
  up.Religiousity = a.Religiousity
  up.Religion = a.Religion
  up.PoliticalAffil = a.PoliticalAffil

  return up
}