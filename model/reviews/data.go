package reviews

import (
	"time"
)

type Review struct {
	ID                int64     `json:"id" datastore:"-"`
	UserID            int64     `json:"userId"`
	RecommendBranchID int64     `json:"recommendBranchId" datastore:",noindex"`
	RecommendID       string    `json:"recommendId" datastore:",noindex"`
	IineID            int64     `json:"iineId"`
	IineUserID        int64     `json:"iineUserId" datastore:"-"` // TODO delete later. use rest api instead.
	IineCount         int       `json:"iineCount" datastore"-"`
	Evidence          string    `json:"evidence" datastore:",noindex"`
	Memo              string    `json:"memo" datastore:",noindex"`
	ForMe             int       `json:"forMe" datastore:",noindex"`
	ForYou            int       `json:"forYou" datastore:",noindex"`
	CreatedAt         time.Time `json:"createdAt" datastore:",noindex"`
}
