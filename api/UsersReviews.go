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

func getUserReviewsData(userId int64, w http.ResponseWriter, r *http.Request) (reviews map[int64]Review) {
	ctx := appengine.NewContext(r)

	// SELECT * FROM Reviews WHERE UserID = 'userId' ORDER BY createdAt
	query := datastore.NewQuery("Review").Filter("UserID =", userId)
	count, err := query.Count(ctx)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable query count  %s", err), http.StatusInternalServerError)
		return
	}

	// do not use GetALL. Because it has 1000 limit.
	reviews = make(map[int64]Review, count)
	itr := query.Run(ctx)

	for {
		var review Review
		key, err := itr.Next(&review)
		if err == datastore.Done {
			break
		}
		if err != nil {
			http.Error(w, fmt.Sprintf("unable datastore %s", err), http.StatusInternalServerError)
			return
		}

		review.ID = key.IntID()
		reviews[key.IntID()] = review

		// _ = datastore.Delete(ctx, key)
	}
	return
}

func getUserReviews(w http.ResponseWriter, r *http.Request) {

	userId, err := strconv.ParseInt(mux.Vars(r)["userId"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("user id is invalid %s", err), http.StatusInternalServerError)
		return
	}

	reviews := getUserReviewsData(userId, w, r)

	res, err := json.Marshal(reviews)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal reviews to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func HandleUserReviews(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserReviews(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
