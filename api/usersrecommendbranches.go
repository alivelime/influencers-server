package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/model/recommendbranches"
)

func getUserRecommendBranches(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}
	recommendBranches, err := recommendbranches.GetUserRecommendBranches(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(recommendBranches) == 0 {
		http.Error(w, "", http.StatusNotFound)
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
