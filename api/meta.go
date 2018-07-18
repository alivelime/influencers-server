package api

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/meta"
	"github.com/alivelime/influs/site"
)

func getMeta(w http.ResponseWriter, r *http.Request) {
	var data meta.Meta
	ctx := appengine.NewContext(r)

	id, ok := getPathParamBase64(w, r, "id")
	if !ok {
		return
	}

	web := site.Factory(id, affiliate.NoTag)
	url := web.GetSimpleURL()

	recommend, err := recommends.Get(ctx, url)
	if err != nil {
		// no cache. get meta data.
		if data, err = web.GetMeta(w, r); err != nil {
			http.Error(w, fmt.Sprintf("Cannot Fetch API: %s", err), http.StatusInternalServerError)
			return
		}
	} else {
		data.Title = "(cached)" + recommend.Title
		data.Image = recommend.Image
		data.Description = recommend.Description
	}

	data.URL = url
	data.Site = web.GetName()

	response(w, data)
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
