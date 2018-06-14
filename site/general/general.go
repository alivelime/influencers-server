package general

import (
	"github.com/alivelime/influs/meta"
)

func GetMeta(url string) (meta.Meta, error) {
	var data meta.Meta

	data.URL = url
	data.Title = "タイトル"
	data.Image = "https://www.google.co.jp/logos/doodles/2018/world-cup-2018-day-1-5741876039647232.2-s.png"
	data.Description = "サイトの詳細"

	return data, nil
}
