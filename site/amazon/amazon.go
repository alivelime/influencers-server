package amazon

import (
	"regexp"

	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https://www\.amazon\.co\.jp/.*/([0-9a-zA-Z]{10})([/?][\s\S]*)?$`)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetASIN(url string) (string, bool) {
	ret := pattern.FindStringSubmatch(url)
	if len(ret) > 0 {
		return ret[0], true
	} else {
		return "", false
	}
}

func GetMeta(url string) (meta.Meta, error) {
	var data meta.Meta
	data.URL = url
	data.Title = "京セラ セラミック ロールシャープナー ファインプレミアシリーズ RS-20-FP"
	data.Image = "https://images-na.ssl-images-amazon.com/images/I/71dUCjXG%2BvL._AC_UL115_.jpg"
	data.Description = "サイズ：197ｘ58ｘ70mm材質：本体樹脂/グラスファイバー強化ポリアミド　ガイドスロット樹脂/ポリアミド　砥石部/ファインセラミックス耐熱温度：80度（樹脂部）"

	return data, nil
}

func MakeSimpleURL(url string) string {
	return ""
}
