package general

import (
	"net/http"

	"github.com/alivelime/influs/meta"
)

type General struct {
	url  string
	name string
}

func NewGeneral(url string) (p *General) {
	p = &General{}
	p.name = "general"
	p.url = url

	return p
}

func (p *General) GetName() string {
	return p.name
}

func (p *General) GetSimpleURL() string {
	return p.url
}

func (p *General) GetAffiliateLink() string {
	return p.url
}

func (p *General) GetMeta(w http.ResponseWriter, r *http.Request) (meta.Meta, error) {
	return meta.Get(p.url, w, r)
}
