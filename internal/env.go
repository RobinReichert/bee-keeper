package internal

import "github.com/RobinReichert/d-bee-core/api"

type env struct {
	dbee dbee.Connection
}

func NewEnv(dBee dbee.Connection) env {
	return env{dbee: dBee}
}
