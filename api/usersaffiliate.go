package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

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

func patchUserAffiliate(w http.ResponseWriter, r *http.Request) {
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
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", userId, session.User.ID), http.StatusBadRequest)
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
