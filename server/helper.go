package main

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

  up.Age = a.Age
  up.Gender = a.Gender
  up.Ethnicity = a.Ethnicity
  up.Zip = a.Zip
  up.Income = a.Income
  up.Education = a.Education
  up.Religiousity = a.Religiousity
  up.Religion = a.Religion
  up.State = a.State
  up.PoliticalAffil = a.PoliticalAffil

  return up
}