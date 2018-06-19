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
)

func getReview(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var review Review
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("review id is invalid %s", err), http.StatusInternalServerError)
		return
	}
	key := datastore.NewKey(ctx, "Review", "", id, nil)
	review.ID = id

	if err := datastore.Get(ctx, key, &review); err != nil {
		http.Error(w, fmt.Sprintf("unable datastore  %s", err), http.StatusNotFound)
		return
	}

	res, err := json.Marshal(review)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func postReview(w http.ResponseWriter, r *http.Request) {
	var review Review
	ctx := appengine.NewContext(r)

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		http.Error(w, fmt.Sprintf("unable read body  %s", err), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &review); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	review.CreatedAt = time.Now()

	key := datastore.NewKey(ctx, "Review", "", 0, nil)
	k, err := datastore.Put(ctx, key, &review)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	review.ID = k.IntID()
	res, err := json.Marshal(review)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func deleteReview(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("review id is invalid %s", err), http.StatusInternalServerError)
		return
	}

	key := datastore.NewKey(ctx, "Review", "", id, nil)

	if err := datastore.Delete(ctx, key); err != nil {
		http.Error(w, fmt.Sprintf("unable  datastore  %s", err), http.StatusNotFound)
		return
	}

}

func HandleReviews(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		postReview(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleReview(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getReview(w, r)

	case "DELETE":
		deleteReview(w, r)

	case "PUT": // do not put
		fallthrough
	case "PATCH": // do not patch
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
