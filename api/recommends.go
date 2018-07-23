package api

import (
	"fmt"
	"net/http"

	"google.golang.org/appengine"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/model/recommends"
	"github.com/alivelime/influs/site"
)

func getRecommend(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	id, ok := getPathParamBase64(w, r, "id")
	if !ok {
		return
	}
	web := site.Factory(id, affiliate.NoTag)
	url := web.GetSimpleURL()

	recommend, err := recommends.Get(ctx, url)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	recommend.Link = web.GetAffiliateLink()
	response(w, recommend)
}

func postRecommend(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var param recommends.Recommend
	if ok := readParam(w, r, &param); !ok {
		return
	}

	web := site.Factory(param.URL, affiliate.NoTag)
	url := web.GetSimpleURL()
	recommend, err := recommends.Get(ctx, url)
	if err != nil || recommend.Title == "" {
		data, _ := web.GetMeta(w, r)
		recommend.URL = url
		recommend.Kind = param.Kind
		recommend.Link = web.GetAffiliateLink()
		recommend.Title = data.Title
		recommend.Image = data.Image
		recommend.Description = data.Description

		// put
		if err := recommends.Put(ctx, &recommend); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		if param.Kind != recommend.Kind {
			recommend.URL = url
			recommend.Kind = param.Kind

			// put
			if err := recommends.Put(ctx, &recommend); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	response(w, recommend)
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
