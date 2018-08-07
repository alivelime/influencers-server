package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/users"
)

func getUser(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}

	user, err := users.Get(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	response(w, user)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	if getCache(ctx, w, prefixUsers) {
		return
	}

	users, err := users.Gets(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if !setCache(ctx, w, prefixUsers, users) {
		return
	}
	response(w, users)
}

func postUser(w http.ResponseWriter, r *http.Request, id int64) {
	if ok := auth.CheckAdmin(w, r); !ok {
		return
	}

	ctx := appengine.NewContext(r)

	var user users.User
	if ok := readParam(w, r, &user); !ok {
		return
	}
	user.ID = id

	if err := users.Put(ctx, &user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, user)
}

func patchUser(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}
	// is mime?
	if id != session.User.ID {
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", id, session.User.ID), http.StatusBadRequest)
		return
	}

	// read and patch
	user, err := users.Get(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if ok := readParam(w, r, &user); !ok {
		return
	}
	if err := users.Put(ctx, &user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, user)
}

func userLeave(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "yet no implementation.", http.StatusNotFound)
}

func HandleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUsers(w, r)

	case "POST":
		postUser(w, r, 0)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleUser(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PUT":
		id, ok := getPathParamInt64(w, r, "id")
		if !ok {
			return
		}
		postUser(w, r, id)

	case "PATCH":
		patchUser(w, r)

	case "GET":
		getUser(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleUserLeave(w http.ResponseWriter, r *http.Request) {
	userLeave(w, r)
}
