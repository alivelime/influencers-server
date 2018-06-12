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

func getUserRecommends(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)

	userId, err := strconv.ParseInt(mux.Vars(r)["userId"], 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("user id is invalid %s", err), http.StatusInternalServerError)
		return
	}

	// SELECT * FROM Recommens INNER JOIN Reviews ON recommendId WHERE UserId = 'userId' GROUP BY recommendId
	recommends := map[string]Recommend{}
	{
		reviews := getUserReviewsData(userId, w, r)

		// group by recommendId
		recommendIds := map[string]bool{} // recommendIds["url"]
		for _, v := range reviews {
			recommendIds[v.RecommendID] = true
		}

		keys := make([]*datastore.Key, len(recommendIds))
		{
			i := 0
			for id, _ := range recommendIds {
				keys[i] = datastore.NewKey(ctx, "Recommend", id, 0, nil)
				i++
			}
		}

		tempRecommends := make([]Recommend, len(recommendIds))
		if err := datastore.GetMulti(ctx, keys, tempRecommends); err != nil {
			merr, ok := err.(appengine.MultiError)
			if !ok {
				//appengine.MultiErrorではない場合はそのエラーを返却
				http.Error(w, fmt.Sprintf("Unable to GetMulti Recommend A: %s", err), http.StatusInternalServerError)
				return
			}

			for _, e := range merr {
				if e == nil {
					//entityが存在する
					continue
				}

				if e == datastore.ErrNoSuchEntity {
					//entityがないだけなのでスルー
					continue
				}

				http.Error(w, fmt.Sprintf("Unable to GetMulti Recommend: %s", err), http.StatusInternalServerError)
				return
			}

		}

		// id を入れる
		for k, v := range keys {
			if tempRecommends[k].Kind != "" {
				tempRecommends[k].URL = v.StringID()
				recommends[v.StringID()] = tempRecommends[k]
			}
		}
	}

	res, err := json.Marshal(recommends)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal recommends to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func HandleUserRecommends(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getUserRecommends(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
