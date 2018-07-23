package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/meta"
	"github.com/alivelime/influs/model/recommends"
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
	if err != nil || recommend.Title == "" {
		// no cache. get meta data.
		if data, err = web.GetMeta(w, r); err != nil {
			http.Error(w, fmt.Sprintf("Cannot Fetch API: %s", err), http.StatusInternalServerError)
			return
		}

		// cache
		recommend.URL = url
		recommend.Link = web.GetAffiliateLink()
		recommend.Title = data.Title
		recommend.Image = data.Image
		recommend.Description = data.Description
		if err := recommends.Put(ctx, &recommend); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
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
