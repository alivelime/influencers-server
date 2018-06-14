package niconico

import (
	"regexp"

	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https?://www\.nicovideo\.jp/watch/(.+)\??.*$`)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetSM(url string) (string, bool) {
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
	data.Title = "ニコニコ動画"
	data.Image = "http://tn.smilevideo.jp/smile?i=11311944"
	data.Description = "ニコニコ動画の説明"

	return data, nil
}
