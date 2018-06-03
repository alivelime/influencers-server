package api

import (
	"bytes"
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

	if err := addLinkList(ctx, recommendBranch.PrevID, recommendBranch.NextID, recommendBranch.ID); err != "" {
		http.Error(w, fmt.Sprintf("Unable to add link list: %s", err), http.StatusInternalServerError)
		return
	}
}

func deleteRecommendBranch(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("recommendBranch id is invalid %s", err), http.StatusInternalServerError)
		return
	}

	key := datastore.NewKey(ctx, "RecommendBranch", "", id, nil)

	// connect link list
	{
		var recommendBranch RecommendBranch
		if err := datastore.Get(ctx, key, &recommendBranch); err != nil {
			http.Error(w, fmt.Sprintf("unable get delete datastore  %s", err), http.StatusNotFound)
			return
		}
		if err := deleteLinkList(ctx, recommendBranch.PrevID, recommendBranch.NextID); err != "" {
			http.Error(w, fmt.Sprintf("Unable to add link list: %s", err), http.StatusInternalServerError)
			return
		}
	}

	if err := datastore.Delete(ctx, key); err != nil {
		http.Error(w, fmt.Sprintf("unable  datastore  %s", err), http.StatusNotFound)
		return
	}

}

func patchRecommendBranch(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var recommendBranch RecommendBranch
	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("recommendBranch id is invalid %s", err), http.StatusInternalServerError)
		return
	}
	key := datastore.NewKey(ctx, "RecommendBranch", "", id, nil)

	if err := datastore.Get(ctx, key, &recommendBranch); err != nil {
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
	if err := json.Unmarshal(body, &recommendBranch); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	// put
	_, err = datastore.Put(ctx, key, &recommendBranch)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
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

func addLinkList(ctx context.Context, prevID int64, nextID int64, addID int64) string {
	return connectLinkList(ctx, prevID, nextID, addID)
}

func deleteLinkList(ctx context.Context, prevID int64, nextID int64) string {
	return connectLinkList(ctx, prevID, nextID, 0)
}
func connectLinkList(ctx context.Context, prevID int64, nextID int64, id int64) string {

	// set list link.
	if prevID != 0 {
		var prev RecommendBranch

		// get
		key := datastore.NewKey(ctx, "RecommendBranch", "", prevID, nil)
		if err := datastore.Get(ctx, key, &prev); err != nil {
			return fmt.Sprintf("unable get previd datastore  %s", err)
		}

		// patch
		if id == 0 { // delete
			prev.NextID = nextID
		} else { // add
			prev.NextID = id
		}

		// put
		if _, err := datastore.Put(ctx, key, &prev); err != nil {
			return fmt.Sprintf("unable put prev datastore  %s", err)
		}
	}
	if nextID != 0 {
		var next RecommendBranch

		// get
		key := datastore.NewKey(ctx, "RecommendBranch", "", nextID, nil)
		if err := datastore.Get(ctx, key, &next); err != nil {
			return fmt.Sprintf("unable get next datastore  %s", err)
		}

		// patch
		if id == 0 { // delete
			next.PrevID = prevID
		} else { // add
			next.PrevID = id
		}

		// put
		if _, err := datastore.Put(ctx, key, &next); err != nil {
			return fmt.Sprintf("unable put prev datastore  %s", err)
		}
	}
	return ""
}
