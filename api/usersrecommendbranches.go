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

func getUserRecommendBranches(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var recommendBranches map[int64]RecommendBranch
	userId, err := strconv.ParseInt(mux.Vars(r)["userId"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("user id is invalid %s", err), http.StatusInternalServerError)
		return
	}

	// SELECT * FROM RecommendBranches WHERE UserID = 'userId' ORDER BY Priority
	// do not use 'priority prop and sort' but use link list. because link list is better than priotiry sort.
	{
		query := datastore.NewQuery("RecommendBranch").Filter("UserID =", userId)
		count, err := query.Count(ctx)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable query count  %s", err), http.StatusInternalServerError)
			return
		}

		// do not use GetALL. Because it has 1000 limit.
		recommendBranches = make(map[int64]RecommendBranch, count)
		itr := query.Run(ctx)

		for {
			var recommendBranch RecommendBranch
			key, err := itr.Next(&recommendBranch)
			if err == datastore.Done {
				break
			}
			if err != nil {
				http.Error(w, fmt.Sprintf("unable datastore %s", err), http.StatusInternalServerError)
				return
			}

			recommendBranch.ID = key.IntID()
			recommendBranches[key.IntID()] = recommendBranch

			// _ = datastore.Delete(ctx, key)
		}
	}

	res, err := json.Marshal(recommendBranches)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func HandleUserRecommendBranches(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserRecommendBranches(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
