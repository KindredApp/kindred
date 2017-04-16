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
		db.Table("qotds").Count(&qotdLen)
		qotdID := *qotdCounter%*qotdLen + 1
		db.Raw("SELECT * FROM qotds WHERE id = ?", qotdID).Scan(&qotd)
		conn.Cmd("HMSET", "qotd", "category", qotd.Category, "type", qotd.QuestionType, "text", qotd.Text, "id", qotd.ID)
		*qotdCounter++
		// repeat function at time specified
		t = time.AfterFunc(time.Duration(24)*time.Hour, f)
	}
	f()
}
