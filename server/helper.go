package main

func defaultSurvey(a UserSurvey) UserProfile {
  var up UserProfile

  aSlice := []int{0, 18, 25, 35, 45, 55, 65}

  for i, v := range aSlice {
    if a.Age >= v {
      up.Age = i
    }
  }

  gSlice := []string{"male", "female", "agender", "genderfluid", "transgender", "other"}

  for i, v := range gSlice {
    if a.Gender == v {
      up.Gender = i
    }
  }

  eSlice := []string{"white", "hispanic or latino", "black or african american", "native american", "asian", "pacific islander", "other"}

  for i, v := range eSlice {
    if a.Ethnicity == v {
      up.Ethnicity = i
    }
  }

  up.Zip = a.Zip
  up.Income = a.Income
  up.Education = a.Education
  up.Spirituality = a.Spirituality
  up.ReligiousAffil = a.ReligiousAffil
  up.State = a.State
  up.PoliticalAffil = a.PoliticalAffil

  return up
}

// func optionalSurvey(a UserOptSurvey) UserProfile{
//   var up UserProfile


//   return up
// }