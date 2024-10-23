package main

import (
	"fmt"
	"log"
	"net/http"

	_ "net/http/pprof"

	"github.com/RobinReichert/bee-keeper/internal"
	"github.com/RobinReichert/d-bee-core/api"
)

func main() {
	go func() {
		log.Println(http.ListenAndServe(":6060", nil))
	}()
	dbee := dbee.Connect("http://app")
	fmt.Println(dbee.Query("SELECT * From test"))
	env := internal.NewEnv(dbee)
	router := internal.Router(env)
	router.Serve()
}
