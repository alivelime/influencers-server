package iherb

import (
	"net/http"
	"regexp"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https://jp\.iherb\.com/pr/([^/]+)/(\d+)([/?][\s\S]*)?$`)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetPID(url string) (string, string) {
	ret := pattern.FindStringSubmatch(url)
	if len(ret) > 2 {
		return ret[1], ret[2]
	} else {
		return "", ""
	}
}

func MakeSimpleURL(url string, product string, id string) string {
	return "https://jp.iherb.com/pr/" + product + "/" + id
}

type Iherb struct {
	url          string
	name         string
	product      string
	id           string
	affiliateTag string
}

func NewIherb(url string, tag affiliate.Tag) (p *Iherb) {
	p = &Iherb{}
	p.name = "iherb"
	p.product, p.id = GetPID(url)
	p.url = MakeSimpleURL(url, p.product, p.id)
	p.affiliateTag = tag.Iherbjp

	return p
}

func (p *Iherb) GetName() string {
	return p.name
}

func (p *Iherb) GetSimpleURL() string {
	return p.url
}

func (p *Iherb) GetAffiliateLink() string {
	return p.url + "?rcode=" + p.affiliateTag
}

func (p *Iherb) GetMeta(w http.ResponseWriter, r *http.Request) (meta.Meta, error) {
	return meta.Get(p.url, w, r)
}
