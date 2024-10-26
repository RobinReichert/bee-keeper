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
	defer r.Body.Close()
	var payload map[string]any
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		ErrorHandler(http.StatusBadRequest, "bad request").ServeHTTP(w, r)
		return
	}
	columns, ok := payload["columns"].([]string)
	if !ok {
		ErrorHandler(http.StatusBadRequest, "bad request").ServeHTTP(w, r)
	}
	log.Println(columns)
	//query := "CREATE TABLE IF NOT EXISTS "

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
	Code    int
	Message string
}

func ErrorHandler(code int, message string) *errorHandler {
	return &errorHandler{Code: code, Message: message}
}

func (t *errorHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	html, err := template.ParseFiles("/app/web/templates/error.html")
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	err = html.Execute(w, t)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}
