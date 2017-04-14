package main

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix.v2/redis"
)

// type QotdRedis struct {
// 	QuestionType string
// 	Category     string
// 	Text         string
// 	ID           int
// }

func worker(db *gorm.DB, conn *redis.Client, qotdCounter *int) {
	var f func()
	var t *time.Timer
	// var qotd Qotd
	var qotdLen []int
	// var qotdRedis QotdRedis
	var circ func(start int)

	f = func() {
		fmt.Println("length before:", qotdLen)
		db.Raw("SELECT id FROM qotds ORDER BY id DESC LIMIT 1").Scan(&qotdLen)
		fmt.Println("length:", qotdLen)
		*qotdCounter++
		// fmt.Println(qotdCounter, time.Now())
		// db.Raw("SELECT * FROM qotds WHERE id = ?", qotdCounter).Scan(&qotd)
		// fmt.Println("QOTD result:", qotd)
		// conn.Cmd("HMSET", "category", qotd.Category, "type", qotd.QuestionType, "text", qotd.Text, "id", qotd.ID)
		t = time.AfterFunc(time.Duration(5)*time.Second, f)
	}

	f()

	circ = func(start int) {
		for i := 0; i < len(qotdLen); i++ {
			fmt.Println(qotdLen[(i+start)%len(qotdLen)])
		}
	}

	circ(0)

	// qotdRedis, err := conn.Cmd("HMGET", "qotd", "type", "text", "id")
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("From redis: ", qotdRedis)
	// defer conn.Close()

}
