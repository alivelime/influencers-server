package api

import (
	"time"
)

type Person struct {
	ID             string    `json:"id"`
	Name           string    `json:"name" datastore:",noindex"`
	MediaType      string    `json:"mediaType" datastore:",noindex"`
	Connection     int64     `json:"connection"`
	Good           int64     `json:"good" datastore:",noindex"`
	Bad            int64     `json:"bad" datastore:",noindex"`
	Follow         int64     `json:"floow"`
	Follower       int64     `json:"floower"`
	Country        string    `json:"country"`
	ComunityID     int64     `json:"comunityId"`
	Comunity       []int64   `json:"comunity"`
	RecommendCount int64     `json:"recommendCount"`
	ReviewCount    int64     `json:"ReviewCount"`
	Date           time.Time `datastore:",noindex"`
}

type FollowList struct {
	I string `json:"i"`
	U string `json:"u"`
}

type Affiliate struct {
	UserID string `json:"userId"`
	Amazon string `json:"amazon"`
	Febe   string `json:"febe"`
}

type RecommendList struct {
	ID           string    `json:"id"`
	UserID       string    `json:"userId"`
	RecommendIDs []string  `json:"linkIds"`
	Date         time.Time `datastore:",noindex"`
}

type Recommend struct {
	ID      string `json:"id"`
	BaseURL string `json:"baseUrl"`
}

type Review struct {
	UserID      string    `json:"userId"`
	RecommendID string    `json:"linkId"`
	Evidence    string    `json:"evidence"`
	Content     string    `json:"content"`
	Date        time.Time `datastore:",noindex"`
}

type Comunity struct {
	ParentUserID string `json:"userId"`
	FamilyUserID string `json:"userId"`
}
