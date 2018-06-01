package api

import (
	"time"
)

type User struct {
	ID             int64     `json:"id" datastore:"-"`
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
	IiyoCount      int64     `json:"iiyoCount" datastore:",noindex"` /* = cound of recommend */
	IineCount      int64     `json:"iinemmendCount" datastore:",noindex"`
	CreatedAt      time.Time `datastore:",noindex"`
	UpdatedAt      time.Time `datastore:",noindex"`
}

type Affiliate struct {
	ID     int64  `json:"id" datastore:"-"`
	Amazon string `json:"amazon" datastore:",noindex"`
	Febe   string `json:"febe" datastore:",noindex"`
	Iherb  string `json:"iherb" datastore:",noindex"`
}

type RecommendBranch struct {
	ID         int64   `json:"id" datastore:"-"`
	UserID     int64   `json:"userId"`
	ParentID   int64   `json:"parentId" datastore:",noindex"`
	ChildrenID []int64 `json:"childId" datastore:",noindex"`
	Priority   int64   `json:"priority" datastore:",oindex"`
	Name       string  `json:"name" datastore:",noindex"`
	ReviewIDs  []int64 `json:"reviewIds" datastore:",noindex"`
}

type Review struct {
	ID          int64     `json:"id" datastore:"-"`
	UserID      int64     `json:"userId"`
	BranchID    int64     `json:"branchId" datastore:",noindex"`
	RecommendID string    `json:"linkId" datastore:",noindex"`
	IineID      int64     `json:"referenceId"`
	IineIDs     []int64   `json:"referenceId" datasotre:"-,noindex"`
	Evidence    string    `json:"evidence"`
	Memo        string    `json:"memo" datastore:",noindex"`
	Importance  int       `json:"importance" datastore:",noindex"`
	Familiarity int       `json:"familiarity" datastore:",noindex"`
	CreatedAt   time.Time `datastore:",noindex"`
}

type Recommend struct {
	Url       string    `json:"url" datastore:"-"`
	Name      string    `json:"name" datastore:",noindex"`
	Kind      string    `json:"string" datastore:",noindex"` // mono, service, information
	CreatedAt time.Time `datastore:",noindex"`
}
