package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

func getRecommendBranch(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var recommendBranch RecommendBranch
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("recommendBranch id is invalid %s", err), http.StatusInternalServerError)
		return
	}
	key := datastore.NewKey(ctx, "RecommendBranch", "", id, nil)
	recommendBranch.ID = id

	if err := datastore.Get(ctx, key, &recommendBranch); err != nil {
		http.Error(w, fmt.Sprintf("unable  datastore  %s", err), http.StatusNotFound)
		return
	}

	res, err := json.Marshal(recommendBranch)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func postRecommendBranch(w http.ResponseWriter, r *http.Request, id int64) {
	var recommendBranch RecommendBranch
	ctx := appengine.NewContext(r)

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		http.Error(w, fmt.Sprintf("unable read body  %s", err), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &recommendBranch); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	// validation
	if recommendBranch.UserID == 0 {
		http.Error(w, fmt.Sprintf("validation error: user id is required. "), http.StatusInternalServerError)
		return
	}

	key := datastore.NewKey(ctx, "RecommendBranch", "", id, nil)
	k, err := datastore.Put(ctx, key, &recommendBranch)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	recommendBranch.ID = k.IntID()
	res, err := json.Marshal(recommendBranch)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func HandleRecommendBranch(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var id int64
		strId, ok := mux.Vars(r)["id"]
		if !ok {
			id = 0
		} else {
			var err error
			id, err = strconv.ParseInt(strId, 10, 64)
			if err != nil {
				http.Error(w, fmt.Sprintf("recommendBranch id is invalid %s", err), http.StatusInternalServerError)
				return
			}
		}
		postRecommendBranch(w, r, id)

	case "GET":
		getRecommendBranch(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
