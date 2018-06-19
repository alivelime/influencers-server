package api

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/site"
)

func getRecommend(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var recommend Recommend

	b, err := base64.StdEncoding.DecodeString(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to decode base64 url : %s", err), http.StatusInternalServerError)
		return
	}
	url := string(b)

	key := datastore.NewKey(ctx, "Recommend", url, 0, nil)
	recommend.URL = url

	if err := datastore.Get(ctx, key, &recommend); err != nil {
		http.Error(w, fmt.Sprintf("unable datastore  %s", err), http.StatusNotFound)
		return
	}

	res, err := json.Marshal(recommend)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal recommend to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func postRecommend(w http.ResponseWriter, r *http.Request) {
	var recommend Recommend
	ctx := appengine.NewContext(r)

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		http.Error(w, fmt.Sprintf("unable read body  %s", err), http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &recommend); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	url := recommend.URL
	key := datastore.NewKey(ctx, "Recommend", url, 0, nil)

	data, _ := site.GetMeta(url, w, r)
	recommend.Title = data.Title
	recommend.Image = data.Image
	recommend.Description = data.Description

	k, err := datastore.Put(ctx, key, &recommend)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	recommend.URL = k.StringID()
	res, err := json.Marshal(recommend)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func HandleRecommends(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		postRecommend(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleRecommend(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PUT":
		postRecommend(w, r)

	case "GET":
		getRecommend(w, r)

	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
