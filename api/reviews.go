package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/reviews"
	"github.com/alivelime/influs/model/timelines"
	"github.com/alivelime/influs/model/users"
)

func getReview(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var review reviews.Review
	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}

	review, err := reviews.Get(ctx, id)
	if err != nil {
		log.Errorf(ctx, err.Error())
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	response(w, review)
}

func postReview(w http.ResponseWriter, r *http.Request) {
	var review reviews.Review
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	if ok := readParam(w, r, &review); !ok {
		return
	}

	// validation
	if review.UserID == 0 {
		log.Errorf(ctx, fmt.Sprintf("validation error: user id is required. "))
		http.Error(w, fmt.Sprintf("validation error: user id is required. "), http.StatusBadRequest)
		return
	}
	// is mine?
	if session.User.ID != review.UserID {
		log.Errorf(ctx,
			fmt.Sprintf("Not allow to post onother users .You %d, Param %d", session.User.ID, review.UserID))
		http.Error(w,
			fmt.Sprintf("Not allow to post onother users .You %d, Param %d", session.User.ID, review.UserID),
			http.StatusBadRequest)
		return
	}
	// exists IineID?
	var respect reviews.Review
	if review.IineID != 0 {
		var err error
		respect, err = reviews.Get(ctx, review.IineID)
		if err != nil {
			http.Error(w, fmt.Sprintf("validation error: iine %d does not exist. ", review.IineID), http.StatusBadRequest)
		}
		if respect.RecommendID != review.RecommendID {
			log.Errorf(ctx, fmt.Sprintf("validation error: difference from yours %s and iine %s. ",
				respect.RecommendID, review.RecommendID))
			http.Error(w, fmt.Sprintf("validation error: difference from yours %s and iine %s. ",
				respect.RecommendID, review.RecommendID),
				http.StatusBadRequest)
		}
		_ = reviews.IncrementIine(ctx, review.IineID)
		_ = users.IncrementIine(ctx, review.UserID)
		_ = users.IncrementInflu(ctx, respect.UserID)
	} else {
		_ = users.IncrementIiyo(ctx, review.UserID)
	}

	// put
	if err := reviews.Put(ctx, &review); err != nil {
		log.Errorf(ctx, err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// put timeline
	if review.IineID != 0 {
		_ = timelines.Put(ctx, &timelines.Timeline{
			I:     review.UserID,
			U:     respect.UserID,
			Event: timelines.Iine,
			What:  review.ID,
		})
		deleteUserCache(ctx, respect.UserID, prefixUserTimeline)
	} else {
		_ = timelines.Put(ctx, &timelines.Timeline{
			I:     review.UserID,
			U:     0,
			Event: timelines.Iiyo,
			What:  review.ID,
		})
	}

	deleteUserCache(ctx, review.UserID, prefixUserTimeline)
	deleteUserCache(ctx, review.UserID, prefixUserReviews)
	deleteUserCache(ctx, review.UserID, prefixUserRecommends)
	deleteCache(ctx, prefixUsers)
	response(w, review)
}

func deleteReview(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	id, ok := getPathParamInt64(w, r, "id")
	if !ok {
		return
	}

	review, err := reviews.Get(ctx, id)
	if err != nil {
		log.Errorf(ctx, err.Error())
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// is mine?
	if session.User.ID != review.UserID {
		log.Errorf(ctx,
			fmt.Sprintf("Not allow to delete onother users .You %d, Param %d", session.User.ID, review.UserID))
		http.Error(w,
			fmt.Sprintf("Not allow to delete onother users .You %d, Param %d", session.User.ID, review.UserID),
			http.StatusBadRequest)
		return
	}

	if err := reviews.Delete(ctx, id); err != nil {
		log.Errorf(ctx, err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response(w, Empty{})
}

func HandleReviews(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		postReview(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleReview(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getReview(w, r)

	case "DELETE":
		deleteReview(w, r)

	case "PUT": // do not put
		fallthrough
	case "PATCH": // do not patch
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
