package main

import (
	"strconv"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix.v2/pool"
)

func worker(db *gorm.DB, p *pool.Pool, qotdCounter *int) {
	conn, err := p.Get()
	defer p.Put(conn)
	if err != nil {
		panic(err)
	}
	
	type QotdOptions struct {
		text string
	}
	var f func()
	var t *time.Timer
	var qotd Qotd
	var qotdLen *int
	var qotdOptions []QotdAnswerOption

	f = func() {
		conn.Cmd("DEL", "options")
		conn.Cmd("DEL", "qotd")
		db.Table("qotds").Count(&qotdLen)
		qotdID := *qotdCounter%*qotdLen + 1
		db.Raw("SELECT * FROM qotds WHERE id = ?", qotdID).Scan(&qotd)
		db.Raw("SELECT * FROM qotd_answer_options WHERE qotd_id = ?", qotdID).Scan(&qotdOptions)
		for i := 0; i < len(qotdOptions); i++ {
			conn.Cmd("HSET", "options", "option"+strconv.Itoa(i+1), qotdOptions[i].Text)
		}
		conn.Cmd("HMSET", "qotd", "category", qotd.Category, "qtype", qotd.QuestionType, "text", qotd.Text, "id", qotd.ID)
		*qotdCounter++
		// repeat function at time specified
		t = time.AfterFunc(time.Duration(5)*time.Second, f)
	}
	f()
}
