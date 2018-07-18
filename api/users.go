package api

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/users"
	"github.com/alivelime/influs/sns/twitter"
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

func postUser(w http.ResponseWriter, r *http.Request, id int64) {
	if ok, _, _ := auth.CheckAdmin(w, r); !ok {
		return
	}

	ctx := appengine.NewContext(r)

	var user User
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
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", id, user.ID), http.StatusBadRequest)
		return
	}

	// read and patch
	user, err := users.Get(userId)
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
