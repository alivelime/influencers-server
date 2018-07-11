package api

import (
	"encoding/base64"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/sns/twitter"
)

func getTwitterAuth(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var redirectTo string
	b, err := base64.StdEncoding.DecodeString(mux.Vars(r)["to"])
	if err != nil {
		redirectTo = ""
	} else {
		redirectTo = string(b)
	}

	url, err := twitter.GetAuthURL(ctx, redirectTo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter: %s", err), http.StatusInternalServerError)
	}

	http.Redirect(w, r, url, http.StatusFound)
}

func getTwitterCallback(w http.ResponseWriter, r *http.Request) {
	url, err := twitter.GetCallbackURL(r)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter callback: %s ,%s", url, err), http.StatusInternalServerError)
	}
	http.Redirect(w, r, url, http.StatusFound)
}

func HandleTwitterAuth(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getTwitterAuth(w, r)

	case "POST":
		fallthrough
	case "PUT":
		fallthrough
	case "PATCH":
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleTwitterCallback(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getTwitterCallback(w, r)

	case "POST":
		fallthrough
	case "PUT":
		fallthrough
	case "PATCH":
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
