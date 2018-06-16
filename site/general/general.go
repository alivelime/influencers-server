package general

import (
	"net/http"

	"github.com/PuerkitoBio/goquery"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"

	"github.com/alivelime/influs/meta"
)

func GetMeta(url string, w http.ResponseWriter, r *http.Request) (meta.Meta, error) {
	var data meta.Meta
	data.URL = url

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)
	res, err := client.Get(url)
	if err != nil {
		data.Title = err.Error()
		return data, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		data.Title = err.Error()
		return data, err
	}
	doc.Find("title").Each(func(_ int, s *goquery.Selection) {
		data.Title = s.Text()
	})
	doc.Find("meta").Each(func(_ int, s *goquery.Selection) {
		attr, _ := s.Attr("name")
		switch attr {
		case "title":
			data.Title, _ = s.Attr("content")
		case "description":
			data.Description, _ = s.Attr("content")
		}
	})
	doc.Find("meta").Each(func(_ int, s *goquery.Selection) {
		attr, _ := s.Attr("property")
		switch attr {
		case "og:title":
			data.Title, _ = s.Attr("content")
		case "og:description":
			data.Description, _ = s.Attr("content")
		case "og:image":
			data.Image, _ = s.Attr("content")
		}
	})

	return data, nil
}
