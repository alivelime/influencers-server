package recommends

type Recommend struct {
	URL         string `json:"url" datastore:"-"`
	Link        string `json:"link" datastore:"-"`
	Title       string `json:"title" datastore:",noindex"`
	Image       string `json:"image" datastore:",noindex"`
	Description string `json:"description" datastore:",noindex"`
	Kind        string `json:"kind" datastore:",noindex"` // mono, service, information
}
