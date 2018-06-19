package affiliate

import (
	"net/http"
)

type Tag struct {
	Amazon string
	Iherb  string
}

func GetUserTag(userId int64, w http.ResponseWriter, r *http.Request) Tag {
	return Tag{Amazon: "cal92re-22", Iherb: "ABR2860"}
}
