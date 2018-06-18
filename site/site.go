package site

import (
	// "github.com/PuerkitoBio/goquery"
	"net/http"

	"github.com/alivelime/influs/meta"
	"github.com/alivelime/influs/site/amazon"
	"github.com/alivelime/influs/site/general"
	"github.com/alivelime/influs/site/niconico"
)

func GetMeta(url string, w http.ResponseWriter, r *http.Request) (meta.Meta, error) {

	if amazon.Has(url) {
		return amazon.GetMeta(url, w, r)
	} else if niconico.Has(url) {
		return niconico.GetMeta(url, w, r)
	}

	return general.GetMeta(url, w, r)
}
