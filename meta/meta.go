package meta

import (
	"bufio"
	"golang.org/x/net/html/charset"
	"io"
	"net/http"

	"github.com/PuerkitoBio/goquery"
	"github.com/mattn/go-encoding"

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

	// convert encoding
	br := bufio.NewReader(res.Body)
	var reader io.Reader = br
	{
		if data, err := br.Peek(4096); err == nil {
			enc, name, _ := charset.DetermineEncoding(data, res.Header.Get("content-type"))
			if enc != nil {
				reader = enc.NewDecoder().Reader(br)
			} else if name != "" {
				if enc := encoding.GetEncoding(name); enc != nil {
					reader = enc.NewDecoder().Reader(br)
				}
			}
		}
	}

	doc, err := goquery.NewDocumentFromReader(reader)
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
