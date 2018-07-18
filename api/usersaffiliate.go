package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/affiliates"
)

func getUserAffiliate(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}

	affiliate, err := affiliates.Get(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	response(w, affiliate)
}

func patchAffiliate(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}
	// is mime?
	if userId != session.User.ID {
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", userId, session.UserID), http.StatusBadRequest)
		return
	}

	// read and patch
	affiliate, _ := affiliates.Get(ctx, userId)
	if ok := readParam(w, r, &affiliate); !ok {
		return
	}
	if err := affiliates.Put(ctx, &affiliate); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, affiliate)
}

func HandleUserAffiliate(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserAffiliate(w, r)

	case "PATCH":
		patchUserAffiliate(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
