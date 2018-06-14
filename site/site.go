package site

import (
	// "github.com/PuerkitoBio/goquery"

	"github.com/alivelime/influs/meta"
	"github.com/alivelime/influs/site/amazon"
	"github.com/alivelime/influs/site/general"
	"github.com/alivelime/influs/site/niconico"
)

func GetMeta(url string) (meta.Meta, error) {

	if amazon.Has(url) {
		return amazon.GetMeta(url)
	} else if niconico.Has(url) {
		return niconico.GetMeta(url)
	}

	return general.GetMeta(url)
}
