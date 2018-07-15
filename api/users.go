package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/sns/twitter"
)

func getUser(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var user User
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("user id is invalid %s", err), http.StatusInternalServerError)
		return
	}
	key := datastore.NewKey(ctx, "User", "", id, nil)
	user.ID = id

	if err := datastore.Get(ctx, key, &user); err != nil {
		http.Error(w, fmt.Sprintf("unable  datastore  %s", err), http.StatusNotFound)
		return
	}

	res, err := json.Marshal(user)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func postUser(w http.ResponseWriter, r *http.Request, id int64) {
	if ok, _, _ := auth.CheckLogin(w, r); !ok {
		return
	}

	var user User
	ctx := appengine.NewContext(r)

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		http.Error(w, fmt.Sprintf("unable read body  %s", err), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &user); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	key := datastore.NewKey(ctx, "User", "", id, nil)
	k, err := datastore.Put(ctx, key, &user)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	user.ID = k.IntID()
	res, err := json.Marshal(user)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func patchUser(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	ok, token, secret := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	data, err := twitter.GetVerify(r, token, secret)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter token: ,%s", err), http.StatusInternalServerError)
		return
	}

	// check if user registration.
	puser, err := getUserFromSNSID(ctx, data.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if puser == nil {
		http.Error(w, "user data not found.", http.StatusNotFound)
		return
	}
	user := *puser

	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("recommendBranch id is invalid %s", err), http.StatusInternalServerError)
		return
	}
	if id != user.ID {
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", id, user.ID), http.StatusInternalServerError)
		return
	}

	// read request json..
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		http.Error(w, fmt.Sprintf("unable read body  %s", err), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// patch
	if err := json.Unmarshal(body, &user); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	// put
	key := datastore.NewKey(ctx, "user", "", user.ID, nil)
	k, err := datastore.Put(ctx, key, &user)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	user.ID = k.IntID()
	res, err := json.Marshal(user)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal user to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func userLeave(w http.ResponseWriter, r *http.Request) {
	return
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
		strId, _ := mux.Vars(r)["id"]
		id, err := strconv.ParseInt(strId, 10, 64)
		if err != nil {
			http.Error(w, fmt.Sprintf("user id is invalid %s", err), http.StatusInternalServerError)
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
