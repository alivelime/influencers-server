package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/recommendbranches"
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
	var recommendBranch recommendbranches.RecommendBranch
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	if ok := readParam(w, r, &recommendBranch); !ok {
		return
	}
	recommendBranch.ID = id

	// validation
	if recommendBranch.UserID == 0 {
		http.Error(w, fmt.Sprintf("validation error: user id is required. "), http.StatusBadRequest)
		return
	}
	// is mine?
	if session.User.ID != recommendBranch.UserID {
		http.Error(w,
			fmt.Sprintf("Not allow to post onother users .You %d, Param %d", session.User.ID, recommendBranch.UserID),
			http.StatusBadRequest)
		return
	}

	// put
	if err := recommendbranches.Put(ctx, &recommendBranch); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, recommendBranch)
}

func patchRecommendBranch(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}
	recommendBranch, err := recommendbranches.Get(ctx, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("recommend branch %d is not found.", id), http.StatusNotFound)
		return
	}
	// is mime?
	if session.User.ID != recommendBranch.UserID {
		http.Error(w,
			fmt.Sprintf("user id is different form your. i %d d %d", recommendBranch.UserID, session.User.ID),
			http.StatusBadRequest)
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
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}
	recommendBranch, err := recommendbranches.Get(ctx, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("recommend branch %d is not found.", id), http.StatusNotFound)
		return
	}
	// is mime?
	if session.User.ID != recommendBranch.UserID {
		http.Error(w,
			fmt.Sprintf("user id is different form your. i %d d %d", recommendBranch.UserID, session.User.ID),
			http.StatusBadRequest)
		return
	}

	if err := recommendbranches.Delete(ctx, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, Empty{})
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
		id, ok := getPathParamInt64(w, r, "id")
		if !ok {
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
