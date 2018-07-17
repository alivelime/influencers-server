package affiliates

type Affiliate struct {
	UserID   int64  `json:"userId" datastore:"-"`
	Amazonjp string `json:"amazonjp" datastore:",noindex"`
	Iherbjp  string `json:"iherbjp" datastore:",noindex"`
}
