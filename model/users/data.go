package users

import (
	"time"
)

type User struct {
	ID         int64     `json:"id" datastore:"-"`
	Name       string    `json:"name" datastore:",noindex"`
	Title      string    `json:"title" datastore:",noindex"`
	Avatar     string    `json:"avatar" datastore:",noindex"`
	Image      string    `json:"image" datastore:",noindex"`
	Color      string    `json:"color" datastore:",noindex"`
	Memo       string    `json:"memo" datastore:",noindex"`
	Link       string    `json:"link" datastore:",noindex"`
	SNSID      int64     `json:"snsId"`
	SNSType    string    `json:"snsType" datastore:",noindex"`
	SNSPower   int       `json:"snsPower" datastore:",noindex"`
	SNSURL     string    `json:"snsUrl" datastore:",noindex"`
	InfluCount int       `json:"influCount" datastore:",noindex"` /* count of follower's iine */
	IiyoCount  int       `json:"iiyoCount" datastore:",noindex"`  /* = cound of recommend */
	IineCount  int       `json:"iineCount" datastore:",noindex"`
	CreatedAt  time.Time `json:"createdAt" datastore:",noindex"`
	UpdatedAt  time.Time `json:"updatedAt" datastore:",noindex"`
}
