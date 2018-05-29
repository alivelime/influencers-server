package api

import (
	"time"
)

type Person struct {
	Name           string    `json:"name"`
	Title          string    `json:"title"`
	Memo           string    `json:"memo" datastore:",noindex"`
	Link           string    `json:"link" datastore:",noindex"`
	MediaType      string    `json:"mediaType" datastore:",noindex"`
	Follow         []int64   `json:"floow" datastore:",noindex"`
	Follower       []int64   `json:"floower" datastore:",noindex"`
	Ignore         []int64   `json:"noneed" datastore:",noindex"`
	Ignored        []int64   `json:"noneed" datastore:",noindex"`
	Comunity       []int64   `json:"comunity" datastore:",noindex"`
	ComunityMember []int64   `json:"comunity" datastore:",noindex"`
	IiyoCount      int64     `json:"iiyoCount" datastore:",noindex"`
	IineCount      int64     `json:"iinemmendCount" datastore:",noindex"`
	ReviewCount    int64     `json:"ReviewCount" datastore:",noindex"`
	Date           time.Time `datastore:",noindex"`
}

type Affiliate struct {
	Amazon string `json:"amazon" datastore:",noindex"`
	Febe   string `json:"febe" datastore:",noindex"`
	Iherb  string `json:"iherb" datastore:",noindex"`
}

type RecommendBranch struct {
	UserID       string    `json:"userId"`
	ParentID     int64     `json:"parentId" datastore:",noindex"`
	ChildrenID   []int64   `json:"childId" datastore:",noindex"`
	Name         string    `json:"name" datastore:",noindex"`
	RecommendIDs []int64   `json:"recommendIds" datastore:",noindex"`
	Date         time.Time `datastore:",noindex"`
}

type Recommend struct {
	Name string `json:"name" datastore:",noindex"`
	Kind string `json:"string" datastore:",noindex"` // mono, service, information
}

type Review struct {
	UserID      int64     `json:"userId"`
	ParentID    int64     `json:"parentId" datastore:",noindex"`
	RecommendID string    `json:"linkId" datastore:",noindex"`
	Evidence    string    `json:"evidence"`
	Memo        string    `json:"memo" datastore:",noindex"`
	Importance  int       `json:"importance" datastore:",noindex"`
	Familiarity int       `json:"familiarity" datastore:",noindex"`
	Date        time.Time `datastore:",noindex"`
}
