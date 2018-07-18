package api

type Community struct {
	ID    int64 `json:"recommendBranchId" datastore:"-"` /* ID is RecommendBranch.ID */
	Title int64 `json:"title" datastore:",noindex"`
	Text  int64 `json:"text" datastore:",noindex"`
	Price int64 `json:"price" datastore:",noindex"`
}

type CommunityMember struct {
	I  int64 `json:"i"`
	ID int64 `json:"id"`
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
	Amount  float64 `json:"amount" datastore:",noindex"`
	Message string  `json:"message" datastore:",noindex"`
}

type Empty struct {
}
