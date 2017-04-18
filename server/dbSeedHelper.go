package main

import (
	"math/rand"
)

func pickRandomState() string {
	states := [51]string{"AL", "AK", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI",
		"ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"}
	randomState := states[rand.Intn(51)]
	return randomState
}
