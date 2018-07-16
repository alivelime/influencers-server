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
)

func getUserAffiliate(w http.ResponseWriter, r *http.Request) {

	var affiliate Affiliate
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("user id is invalid %s", err), http.StatusInternalServerError)
		return
	}
	key := datastore.NewKey(ctx, "Affiliate", "", id, nil)
	affiliate.UserID = id

	if err := datastore.Get(ctx, key, &affiliate); err != nil {
		http.Error(w, fmt.Sprintf("unable  datastore  %s", err), http.StatusNotFound)
		return
	}

	res, err := json.Marshal(reviews)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal affiliate to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func patchAffiliate(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	ok, token, secret := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	puser, err := session.GetUser(ctx, token)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if puser == nil {
		http.Error(w, "user data not found.", http.StatusNotFound)
		return
	}
	user := *puser

	if err := auth.CheckIsMine(r, "id", user); err != nil {
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", id, user.ID), http.StatusInternalServerError)
		return
	}

	// get
	var affiliate Affiliate
	key := datastore.NewKey(ctx, "Affiliate", "", user.ID, nil)
	affiliate.UserID = user.ID

	if err := datastore.Get(ctx, key, &affiliate); err != nil {
		http.Error(w, fmt.Sprintf("unable  datastore  %s", err), http.StatusNotFound)
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
	if err := json.Unmarshal(body, &affiliate); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	// put
	k, err := datastore.Put(ctx, key, &affiliate)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(affiliate)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal user to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
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
