package api

import (
	"context"
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

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}

	recommendBranch, err := recommendbranches.Get(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	response(w, recommendBranch)
}

func postRecommendBranch(w http.ResponseWriter, r *http.Request, id int64) {
	var recommendBranch RecommendBranch
	ctx := appengine.NewContext(r)

	session, err := auth.CheckLoginAndGetSession(w, r)
	if err != nil {
		return
	}

	if ok := readParam(w, r, &recommendBranch); !ok {
		return
	}

	// validation
	if recommendBranch.UserID == 0 {
		http.Error(w, fmt.Sprintf("validation error: user id is required. "), http.StatusBadRequest)
		return
	}

	// put
	if err := recommendbranches.Put(ctx, &recommendBranch); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(recommendBranch)
}

func patchRecommendBranch(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLoginAndGetSession(w, r)
	if !ok {
		return
	}

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}
	recommendBranch := recommendbranches.Get(ctx, id)
	// is mime?
	if recommendBranch.UserID != session.userId {
		http.Error(w, fmt.Sprintf("user id is different form your. i %d d %d", userId, session.UserID), http.StatusBadRequest)
		return
	}

	// read and patch
	if ok := readParam(w, r, &recommendBranch); !ok {
		return
	}
	if err := recommendbranches.Put(ctx, &recommendBranch); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, recommendBranch)
}

func deleteRecommendBranch(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "not implement.", http.StatusNotFound)
}

func HandleRecommendBranches(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		postRecommendBranch(w, r, 0)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleRecommendBranch(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PUT":
		strId, _ := mux.Vars(r)["id"]
		id, err := strconv.ParseInt(strId, 10, 64)
		if err != nil {
			http.Error(w, fmt.Sprintf("recommendBranch id is invalid %s", err), http.StatusInternalServerError)
			return
		}
		postRecommendBranch(w, r, id)

	case "PATCH":
		patchRecommendBranch(w, r)

	case "GET":
		getRecommendBranch(w, r)

	case "DELETE":
		deleteRecommendBranch(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func addLinkList(ctx context.Context, prevID int64, nextID int64, addID int64) error {
	return connectLinkList(ctx, prevID, nextID, addID)
}

func deleteLinkList(ctx context.Context, prevID int64, nextID int64) error {
	return connectLinkList(ctx, prevID, nextID, 0)
}
func connectLinkList(ctx context.Context, prevID int64, nextID int64, id int64) (err error) {

	// set list link.
	if prevID != 0 {
		var prev RecommendBranch

		// get
		key := datastore.NewKey(ctx, "RecommendBranch", "", prevID, nil)
		if err = datastore.Get(ctx, key, &prev); err != nil {
			return
		}

		// patch
		if id == 0 { // delete
			prev.NextID = nextID
		} else { // add
			prev.NextID = id
		}

		// put
		if _, err = datastore.Put(ctx, key, &prev); err != nil {
			return
		}
	}
	if nextID != 0 {
		var next RecommendBranch

		// get
		key := datastore.NewKey(ctx, "RecommendBranch", "", nextID, nil)
		if err = datastore.Get(ctx, key, &next); err != nil {
			return
		}

		// patch
		if id == 0 { // delete
			next.PrevID = prevID
		} else { // add
			next.PrevID = id
		}

		// put
		if _, err = datastore.Put(ctx, key, &next); err != nil {
			return
		}
	}
	return
}
