package amazon

import (
	"net/http"
	"os"
	"regexp"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/urlfetch"

	"github.com/utekaravinash/gopaapi5"
	"github.com/utekaravinash/gopaapi5/api"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https?://www\.amazon(\.co)?\.jp/.*/([0-9a-zA-Z]{10})([/?][\s\S]*)?$`)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetASIN(url string) string {
	ret := pattern.FindStringSubmatch(url)
	if len(ret) > 0 {
		return ret[2]
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

	client, err := gopaapi5.NewClient(os.Getenv("PA_ACCESS_KEY_ID"), os.Getenv("PA_SECRET_ACCESS_KEY"), os.Getenv("PA_ASSOCIATE_TAG"), api.Japan)
	if err != nil {
		return data, err
	}
	if err := client.SetHttpClient(urlfetch.Client(ctx)); err != nil {
		return data, err
	}

	params := api.GetItemsParams{
		Condition:            api.Any,
		CurrencyOfPreference: api.JapaneseYen,
		Merchant:             api.AllMerchants,
		ItemIds: []string{
			p.asin,
		},
		Resources: []api.Resource{
			api.ImagesPrimarySmall,
			api.ItemInfoTitle,
			api.ItemInfoByLineInfo,
			api.ItemInfoClassifications,
		},
	}
	response, err := client.GetItems(ctx, &params)
	if err != nil {
		data.URL = p.url
		data.Title = "error " + err.Error()
		return data, err
	}

	defer func() {
		err := recover()
		if err != nil {
			log.Errorf(ctx, "Amazon Error %s %s %s", p.url, response, err)
		}
	}()

	item := response.ItemsResult.Items[0]
	data.URL = p.url
	data.Title = item.ItemInfo.Title.DisplayValue
	data.Image = item.Images.Primary.Small.URL
	data.Description = item.ItemInfo.ByLineInfo.Contributors[0].Name + " " + item.ItemInfo.Classifications.ProductGroup.DisplayValue

	return data, nil
}
