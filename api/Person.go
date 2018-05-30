package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

func getPerson(w http.ResponseWriter, r *http.Request) {
	var person Person
	person.Name = mux.Vars(r)["id"]
	res, err := json.Marshal(person)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func postPerson(w http.ResponseWriter, r *http.Request) {
}

func HandlePerson(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		postPerson(w, r)

	case "GET":
		getPerson(w, r)
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
