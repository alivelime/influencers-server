package meta

import (
	"net/http"

	"github.com/PuerkitoBio/goquery"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/urlfetch"
)

type Meta struct {
	URL         string `json:"url"`
	Site        string `json:"site"`
	Title       string `json:"title"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

func Get(url string, w http.ResponseWriter, r *http.Request) (Meta, error) {
	var data Meta
	data.URL = url

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)
	res, err := client.Get(url)
	if err != nil {
		log.Errorf(ctx, "%s %s", url, err)
		data.Title = err.Error()
		return data, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Errorf(ctx, "%s %s", url, err)
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
		case "og:images":
			data.Image, _ = s.Attr("content")
		}
	})

	return data, nil
}
