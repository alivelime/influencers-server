package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/model/recommends"
)

func getUserRecommends(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}

	ret, err := recommends.GetUserRecommends(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, ret)
}

func HandleUserRecommends(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserRecommends(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
