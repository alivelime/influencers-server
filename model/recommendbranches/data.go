package recommendbranches

type RecommendBranch struct {
	ID          int64  `json:"id" datastore:"-"`
	UserID      int64  `json:"userId"`
	ParentID    int64  `json:"parentId" datastore:",noindex"`
	PrevID      int64  `json:"prevId" datastore:",oindex"`
	NextID      int64  `json:"nextId" datastore:",oindex"`
	Name        string `json:"name" datastore:",noindex"`
	RecommendId string `json:"recommendId" datastore:",noindex"`
}
