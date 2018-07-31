package api

type Community struct {
	ID    int64  `json:"recommendBranchId,string" datastore:"-"` /* ID is RecommendBranch.ID */
	Title string `json:"title" datastore:",noindex"`
	Text  string `json:"text" datastore:",noindex"`
	Price int    `json:"price" datastore:",noindex"`
}

type CommunityMember struct {
	I  int64 `json:"i,string"`
	ID int64 `json:"id,string"`
}

type NagesenInfo struct {
	/* ID is UserID */
	Bitcoin  string `json:"bitcoin"`
	Ethereum string `json:"ethereum"`
}

type NagesenMessage struct {
	ID      int64   `json:"id,string" datastore:"-"`
	I       int64   `json:"i,string"`
	U       int64   `json:"u,string"`
	TxnId   string  `json:"txnId"`
	Amount  float64 `json:"amount" datastore:",noindex"`
	Message string  `json:"message" datastore:",noindex"`
}

type Empty struct {
}
