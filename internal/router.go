package internal

import (
	"log"
	"net/http"
)

type router struct {
	mux *http.ServeMux
}

func Router(env env) router {
	mux := http.NewServeMux()
	router := router{mux: mux}

	//api
	mux.Handle("/tableNames", TableNamesHandler(env))
	mux.Handle("/newTable", NewTableHandler(env))

	//templates
	mux.Handle("/docs", TemplateHandler("/docs", "docs.html"))
	mux.Handle("/tables", TemplateHandler("/tables", "tables.html"))
	mux.Handle("/", TemplateHandler("/", "welcome.html"))

	//static content
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("/app/web/static/"))))

	log.Println("successfully set up router")
	return router
}

func (t *router) Serve() {
	log.Println("now receiving on port 80")
	err := http.ListenAndServe(":80", t.mux)
	if err != nil {
		panic(err)
	}
}
