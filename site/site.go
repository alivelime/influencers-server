package site

import (
	// "github.com/PuerkitoBio/goquery"
	"net/http"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/meta"
	"github.com/alivelime/influs/site/amazon"
	"github.com/alivelime/influs/site/general"
	"github.com/alivelime/influs/site/iherb"
	"github.com/alivelime/influs/site/niconico"
)

type Site interface {
	GetName() (name string)
	GetSimpleURL() (simpleURL string)
	GetAffiliateLink() (link string)
	GetMeta(w http.ResponseWriter, r *http.Request) (meta.Meta, error)
}

func Factory(url string, tag affiliate.Tag) Site {
	if amazon.Has(url) {
		return amazon.NewAmazon(url, tag)
	} else if iherb.Has(url) {
		return iherb.NewIherb(url, tag)
	} else if niconico.Has(url) {
		return niconico.NewNiconico(url)
	}

	return general.NewGeneral(url)
}
