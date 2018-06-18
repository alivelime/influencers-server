package niconico

import (
	"bytes"
	"encoding/xml"
	"io"
	"net/http"
	"regexp"
	"strconv"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/urlfetch"

	"github.com/alivelime/influs/meta"
)

var pattern = regexp.MustCompile(`^https?://[^./]+\.nicovideo\.jp/watch/(.+)\??.*$`)

const (
	endpoint = "http://ext.nicovideo.jp/api/getthumbinfo/"
)

func Has(url string) bool {
	return pattern.MatchString(url)
}

func GetID(url string) (string, bool) {
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

	id, ok := GetID(url)
	if !ok {
		return data, nil
	}

	req, _ := http.NewRequest("GET", endpoint+id, nil)
	client := urlfetch.Client(ctx)
	res, err := client.Do(req)
	if err != nil {
		return data, err
	}
	defer res.Body.Close()

	//Parse result
	var nico NicovideoThumbResponse
	buf := new(bytes.Buffer)
	io.Copy(buf, res.Body)

	err = xml.Unmarshal(buf.Bytes(), &nico)
	if err != nil {
		return data, err
	}
	log.Debugf(ctx, "%+v", buf.String())
	log.Debugf(ctx, "%+v", nico)
	thumb := nico.Thumb

	data.URL = thumb.WatchURL
	data.Title = thumb.Title
	data.Image = thumb.ThumbnailURL
	data.Description = "投稿者 " + thumb.UserNickName +
		" | 再生数" + strconv.Itoa(thumb.ViewCounter) +
		" | コメント " + strconv.Itoa(thumb.CommentNum) +
		" | マイリス " + strconv.Itoa(thumb.MylistCounter) +
		"\n" + thumb.Description +
		"\n" + thumb.LastResBody

	return data, nil
}

type NicovideoThumbResponse struct {
	Thumb struct {
		Title         string `xml:"title"`
		ThumbnailURL  string `xml:"thumbnail_url"`
		Description   string `xml:"description"`
		ViewCounter   int    `xml:"view_counter"`
		CommentNum    int    `xml:"comment_num"`
		MylistCounter int    `xml:"mylist_counter"`
		LastResBody   string `xml:"last_res_body"`
		WatchURL      string `xml:"watch_url"`
		UserNickName  string `xml:"user_nickname"`
	} `xml:"thumb"`
}
