package main

import (
	"log"
	_ "net/http/pprof"

	"github.com/RobinReichert/bee-keeper/internal"
	dbee "github.com/RobinReichert/d-bee-core/api"
)

func main() {
	dbee := dbee.Connect("http://dbee-app:8081")
	log.Println(dbee.Query("SELECT * FROM test"))
	env := internal.NewEnv(dbee)
	router := internal.Router(env)
	router.Serve()
}
