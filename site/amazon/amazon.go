package amazon

import (
	"encoding/xml"
	"net/http"
	"os"
	"regexp"

	"github.com/DDRBoxman/go-amazon-product-api"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"

	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https://www\.amazon\.co\.jp/.*/([0-9a-zA-Z]{10})([/?][\s\S]*)?$`)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetASIN(url string) (string, bool) {
	ret := pattern.FindStringSubmatch(url)
	if len(ret) > 0 {
		return ret[1], true
	} else {
		return "", false
	}
}

func GetMeta(url string, w http.ResponseWriter, r *http.Request) (meta.Meta, error) {
	var data meta.Meta
	ctx := appengine.NewContext(r)

	var api amazonproduct.AmazonProductAPI
	api.AccessKey = os.Getenv("AWS_ACCESS_KEY_ID")
	api.SecretKey = os.Getenv("AWS_SECRET_ACCESS_KEY")
	api.Host = "webservices.amazon.co.jp"
	api.AssociateTag = os.Getenv("AWS_ASSOCIATE_TAG")
	api.Client = urlfetch.Client(ctx)

	asin, _ := GetASIN(url)
	result, err := api.ItemLookup(asin)
	if err != nil {
		return data, err
	}

	//Parse result
	aws := new(amazonproduct.ItemLookupResponse)
	err = xml.Unmarshal([]byte(result), aws)
	if err != nil {
		return data, err
	}
	item := aws.Items.Item

	data.URL = item.DetailPageURL
	data.Title = item.ItemAttributes.Title
	data.Image = item.SmallImage.URL
	data.Description = item.ItemAttributes.Author + " " + item.ItemAttributes.ProductGroup

	return data, nil
}

func MakeSimpleURL(url string) string {
	return ""
}
