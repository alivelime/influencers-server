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

	"github.com/alivelime/influs/model/recommendbranches"
)

func getUserRecommendBranches(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}
	recommendBranches := recommendbranches.GetUserRecommendBranches(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, recommendBranches)
}

func HandleUserRecommendBranches(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserRecommendBranches(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
