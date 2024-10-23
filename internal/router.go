package internal

import (
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

	//templates
	mux.Handle("/docs", TemplateHandler("/docs", "docs.html"))
	mux.Handle("/tables", TemplateHandler("/tables", "tables.html"))
	mux.Handle("/", TemplateHandler("/", "welcome.html"))

	//static content
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("/app/web/static/"))))

	return router
}

func (t *router) Serve() {
	err := http.ListenAndServe(":80", t.mux)
	if err != nil {
		panic(err)
	}
}
