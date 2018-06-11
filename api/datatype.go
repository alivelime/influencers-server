package api

import (
	"time"
)

type User struct {
	ID              int64     `json:"id" datastore:"-"`
	Name            string    `json:"name"`
	Title           string    `json:"title"`
	Memo            string    `json:"memo" datastore:",noindex"`
	Link            string    `json:"link" datastore:",noindex"`
	MediaType       string    `json:"mediaType" datastore:",noindex"`
	Follow          []int64   `json:"foloow" datastore:"-"`
	Follower        []int64   `json:"foloower" datastore:"-"`
	Ignore          []int64   `json:"noneed" datastore:"-"`
	Ignored         []int64   `json:"noneed" datastore:"-"`
	Community       []int64   `json:"community" datastore:"-"`
	CommunityMember []int64   `json:"community" datastore:"-"`
	InfluCount      int64     `json:"influCount" datastore:"-"` /* count of follower's iine */
	IiyoCount       int64     `json:"iiyoCount" datastore:"-"`  /* = cound of recommend */
	IineCount       int64     `json:"iinemmendCount" datastore:"-"`
	CreatedAt       time.Time `datastore:",noindex"`
	UpdatedAt       time.Time `datastore:",noindex"`
}

type Follow struct {
	I int64 `json:"i"`
	U int64 `json:"u"`
}

type Ignore struct {
	I int64 `json:"i"`
	U int64 `json:"u"`
}

type Community struct {
	ID    int64 `json:"recommendBranchId" datastore:"-"` /* ID is RecommendBranch.ID */
	Title int64 `json:"title" datastore:",noindex"`
	Text  int64 `json:"text" datastore:",noindex"`
	Price int64 `json:"price" datastore:",noindex"`
}

type CommunityMember struct {
	I           int64 `json:"i"`
	CommunityID int64 `json:"u"`
}

type NagesenInfo struct {
	/* ID is UserID */
	Bitcoin  string `json:"bitcoin"`
	Ethereum string `json:"ethereum"`
}

type NagesenMessage struct {
	ID      int64   `json:"id" datastore:"-"`
	I       int64   `json:"i"`
	U       int64   `json:"u"`
	TxnId   string  `json:"txnId"`
	Amount  float64 `json:"amount" datastore:"-"`
	Message string  `json:"message" datastore:"-"`
}

type Affiliate struct {
	ID     int64  `json:"id" datastore:"-"`
	Amazon string `json:"amazon" datastore:",noindex"`
	Febe   string `json:"febe" datastore:",noindex"`
	Iherb  string `json:"iherb" datastore:",noindex"`
}

type RecommendBranch struct {
	ID       int64  `json:"id" datastore:"-"`
	UserID   int64  `json:"userId"`
	ParentID int64  `json:"parentId" datastore:",noindex"`
	PrevID   int64  `json:"prevId" datastore:",oindex"`
	NextID   int64  `json:"nextId" datastore:",oindex"`
	Name     string `json:"name" datastore:",noindex"`
}

type Review struct {
	ID                int64     `json:"id" datastore:"-"`
	UserID            int64     `json:"userId"`
	RecommendBranchID int64     `json:"recommendBranchId" datastore:",noindex"`
	RecommendID       string    `json:"linkId" datastore:",noindex"`
	IineID            int64     `json:"iineId"`
	Evidence          string    `json:"evidence"`
	Memo              string    `json:"memo" datastore:",noindex"`
	ForMe             int       `json:"forMe" datastore:",noindex"`
	ForYou            int       `json:"forYou" datastore:",noindex"`
	CreatedAt         time.Time `datastore:",noindex"`
}

type Recommend struct {
	URL         string `json:"url" datastore:"-"`
	Title       string `json:"title" datastore:",noindex"`
	Description string `json:"title" datastore:",noindex"`
	Name        string `json:"name" datastore:",noindex"`
	Kind        string `json:"string" datastore:",noindex"` // mono, service, information
}
