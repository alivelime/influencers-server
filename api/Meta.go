package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	urlm "net/url"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/meta"
	"github.com/alivelime/influs/site"
)

func getMeta(w http.ResponseWriter, r *http.Request) {
	var data meta.Meta
	ctx := appengine.NewContext(r)

	url := mux.Vars(r)["id"]
	url, _ = urlm.QueryUnescape(url)
	key := datastore.NewKey(ctx, "Recommend", url, 0, nil)
	var recommend Recommend
	recommend.URL = url

	if err := datastore.Get(ctx, key, &recommend); err != nil {
		data, _ = site.GetMeta(url)
	} else {
		data.Title = "(cached)" + recommend.Title
		data.Image = recommend.Image
		data.Description = recommend.Description
	}

	res, err := json.Marshal(data)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal meta to json: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}

func HandleMeta(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getMeta(w, r)

	case "POST":
		fallthrough
	case "PUT":
		fallthrough
	case "PATCH":
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}
