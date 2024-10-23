package internal

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
)

type newTableHandler struct {
	env *env
}

func NewTableHandler(env *env) *newTableHandler {
	return &newTableHandler{env: env}
}

func (t *newTableHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var payload map[string]any
	err := json.NewDecoder(r.Body).Decode(&payload)
	defer r.Body.Close()
	//query := "CREATE TABLE IF NOT EXISTS "
	if err != nil {
		ErrorHandler(http.StatusInternalServerError, "internal server error").ServeHTTP(w, r)
		return
	}

	err = t.env.dbee.Exec("CREATE TABLE test (id SERIAL PRIMARY KEY, status BOOLEAN, score INT, email TEXT NOT NULL)")
	if err != nil {
		return
	}
}

type tableNamesHandler struct {
	env env
}

func TableNamesHandler(env env) *tableNamesHandler {
	return &tableNamesHandler{env: env}
}

func (t *tableNamesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	result, err := t.env.dbee.Query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'")
	if err != nil {
		log.Println(err)
		ErrorHandler(http.StatusInternalServerError, "internal server error").ServeHTTP(w, r)
		return
	}
	responseBody, err := json.Marshal(result)
	if err != nil {
		log.Println(err)
		ErrorHandler(http.StatusInternalServerError, "internal server error").ServeHTTP(w, r)
		return
	}
	w.Write(responseBody)
}

type templateHandler struct {
	route    string
	fileName string
}

func TemplateHandler(route string, fileName string) *templateHandler {
	return &templateHandler{route: route, fileName: fileName}
}

func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != t.route {
		ErrorHandler(http.StatusNotFound, "not found").ServeHTTP(w, r)
		return
	}
	http.ServeFile(w, r, "/app/web/templates/"+t.fileName)
}

type errorHandler struct {
	code    int
	message string
}

func ErrorHandler(code int, message string) *errorHandler {
	return &errorHandler{code: code, message: message}
}

func (t *errorHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	html, err := template.ParseFiles("/app/web/templates/error.html")
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	html.Execute(w, *t)
}
