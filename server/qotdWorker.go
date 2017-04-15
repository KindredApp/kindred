package main

import (
	"time"

	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix.v2/redis"
)

func worker(db *gorm.DB, conn *redis.Client, qotdCounter *int) {
	var f func()
	var t *time.Timer
	var qotd Qotd
	var qotdLen *int

	f = func() {
		// get length of qotd table from db
		db.Table("qotds").Count(&qotdLen)

		// turn qotdCounter into ID number
		qotdID := *qotdCounter%*qotdLen + 1

		// get qotd from db
		db.Raw("SELECT * FROM qotds WHERE id = ?", qotdID).Scan(&qotd)

		// insert qotd into redis
		conn.Cmd("HMSET", "category", qotd.Category, "type", qotd.QuestionType, "text", qotd.Text, "id", qotd.ID)

		// increment qotdcounter
		*qotdCounter++

		// repeat function at time specified
		t = time.AfterFunc(time.Duration(24)*time.Hour, f)
	}

	f()

}
