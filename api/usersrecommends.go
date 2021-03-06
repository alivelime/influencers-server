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
	if getUserCache(ctx, w, userId, prefixUserRecommends) {
		return
	}

	ret, err := recommends.GetUserRecommends(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(ret) == 0 {
		http.Error(w, "", http.StatusNotFound)
		return
	}

	if !setUserCache(ctx, w, userId, prefixUserRecommends, ret) {
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
