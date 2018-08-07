package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/follows"
	"github.com/alivelime/influs/model/timelines"
)

func getUserFollows(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}
	if getUserCache(ctx, w, userId, prefixUserFollows) {
		return
	}

	followIds, err := follows.GetMyFollows(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(followIds) == 0 {
		http.Error(w, "", http.StatusNotFound)
		return
	}

	if !setUserCache(ctx, w, userId, prefixUserFollows, followIds) {
		return
	}
	response(w, followIds)
}

func getUserFollowers(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	userId, ok := getPathParamInt64(w, r, "userId")
	if !ok {
		return
	}
	if getUserCache(ctx, w, userId, prefixUserFollowers) {
		return
	}

	followerIds, err := follows.GetMyFollowers(ctx, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(followerIds) == 0 {
		http.Error(w, "", http.StatusNotFound)
		return
	}

	if !setUserCache(ctx, w, userId, prefixUserFollowers, followerIds) {
		return
	}
	response(w, followerIds)
}

func postUserFollow(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	i, ok := getPathParamInt64(w, r, "i")
	if !ok {
		return
	}
	u, ok := getPathParamInt64(w, r, "u")
	if !ok {
		return
	}
	// is mime?
	if i != session.User.ID {
		http.Error(w, fmt.Sprintf("user id is different form yours. i %d d %d", i, session.User.ID), http.StatusBadRequest)
		return
	}

	if err := follows.PostFromUserID(ctx, i, u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	deleteUserCache(ctx, i, prefixUserFollows)
	deleteUserCache(ctx, u, prefixUserFollowers)

	// put timeline.
	_ = timelines.Put(ctx, &timelines.Timeline{
		I:     i,
		U:     u,
		Event: timelines.Follow,
	})
	deleteUserCache(ctx, i, prefixUserTimeline)
	deleteUserCache(ctx, u, prefixUserTimeline)
}

func deleteUserFollow(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	i, ok := getPathParamInt64(w, r, "i")
	if !ok {
		return
	}
	u, ok := getPathParamInt64(w, r, "u")
	if !ok {
		return
	}
	// is mime?
	if i != session.User.ID {
		http.Error(w, fmt.Sprintf("user id is different form yours. i %d d %d", i, session.User.ID), http.StatusBadRequest)
		return
	}

	if err := follows.DeleteFromUserID(ctx, i, u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	deleteUserCache(ctx, i, prefixUserFollows)
	deleteUserCache(ctx, u, prefixUserFollowers)
}

func HandleUserFollows(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserFollows(w, r)

	case "POST":
		postUserFollow(w, r)

	case "DELETE":
		deleteUserFollow(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleUserFollowers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserFollowers(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
