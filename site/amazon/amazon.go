package amazon

import (
	"encoding/xml"
	"net/http"
	"os"
	"regexp"

	"github.com/DDRBoxman/go-amazon-product-api"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https://www\.amazon\.co\.jp/.*/([0-9a-zA-Z]{10})([/?][\s\S]*)?$`)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetASIN(url string) string {
	ret := pattern.FindStringSubmatch(url)
	if len(ret) > 0 {
		return ret[1]
	} else {
		return ""
	}
}

func MakeSimpleURL(url string, asin string) string {
	return "https://www.amazon.co.jp/dp/" + asin
}

type Amazon struct {
	url          string
	name         string
	asin         string
	affiliateTag string
}

func NewAmazon(url string, tag affiliate.Tag) (p *Amazon) {
	p = &Amazon{}
	p.name = "amazon"
	p.asin = GetASIN(url)
	p.url = MakeSimpleURL(url, p.asin)
	p.affiliateTag = tag.Amazonjp

	return p
}

func (p *Amazon) GetName() string {
	return p.name
}

func (p *Amazon) GetSimpleURL() string {
	return p.url
}

func (p *Amazon) GetAffiliateLink() string {
	return "http://www.amazon.co.jp/exec/obidos/ASIN/" + p.asin + "/" + p.affiliateTag + "/ref=nosim/"
}

func (p *Amazon) GetMeta(w http.ResponseWriter, r *http.Request) (meta.Meta, error) {
	var data meta.Meta
	ctx := appengine.NewContext(r)

	var api amazonproduct.AmazonProductAPI
	api.AccessKey = os.Getenv("AWS_ACCESS_KEY_ID")
	api.SecretKey = os.Getenv("AWS_SECRET_ACCESS_KEY")
	api.Host = "webservices.amazon.co.jp"
	api.AssociateTag = os.Getenv("AWS_ASSOCIATE_TAG")
	api.Client = urlfetch.Client(ctx)

	result, err := api.ItemLookup(p.asin)
	if err != nil {
		return data, err
	}

	//Parse result
	aws := new(amazonproduct.ItemLookupResponse)
	err = xml.Unmarshal([]byte(result), aws)
	if err != nil {
		data.URL = p.url
		data.Title = "error " + err.Error()
		return data, err
	}
	if !aws.Items.Request.IsValid {
		data.URL = p.url
		data.Title = ""
		return data, err
	}
	item := aws.Items.Item

	data.URL = p.url
	data.Title = item.ItemAttributes.Title
	data.Image = item.SmallImage.URL
	data.Description = item.ItemAttributes.Author + " " + item.ItemAttributes.ProductGroup

	return data, nil
}
