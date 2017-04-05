package main

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

// type UserCache struct {
//   Name string
//   Token string
// }

// func populateCache(user map[string]string) *UserCache {
//   var err error
//   uc := new(UserCache)
//   uc.Name = user["Name"]
//   uc.Token = user["Token"]
//   return uc
// }

func defaultSurvey(a UserSurvey) UserProfile {
  var up UserProfile

  // aSlice := []int{0, 18, 25, 35, 45, 55, 65}

  // for i, v := range aSlice {
  //   if a.Age >= v {
  //     up.Age = i
  //   }
  // }

  // gSlice := []string{"male", "female", "agender", "genderfluid", "transgender", "other"}

  // for i, v := range gSlice {
  //   if a.Gender == v {
  //     up.Gender = i
  //   }
  // }

  // eSlice := []string{"white", "hispanic or latino", "black or african american", "native american", "asian", "pacific islander", "other"}

  // for i, v := range eSlice {
  //   if a.Ethnicity == v {
  //     up.Ethnicity = i
  //   }
  // }

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