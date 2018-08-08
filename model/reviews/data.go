package reviews

import (
	"time"
)

type Review struct {
	ID                int64     `json:"id,string" datastore:"-"`
	UserID            int64     `json:"userId,string"`
	RecommendBranchID int64     `json:"recommendBranchId,string" datastore:",noindex"`
	RecommendID       string    `json:"recommendId" datastore:",noindex"`
	IineID            int64     `json:"iineId,string"`
	IineCount         int       `json:"iineCount" datastore:",noindex"`
	Evidence          string    `json:"evidence" datastore:",noindex"`
	Memo              string    `json:"memo" datastore:",noindex"`
	ForMe             int       `json:"forMe" datastore:",noindex"`
	ForYou            int       `json:"forYou" datastore:",noindex"`
	CreatedAt         time.Time `json:"createdAt" datastore:",noindex"`
}
