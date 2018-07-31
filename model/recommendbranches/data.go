package recommendbranches

type RecommendBranch struct {
	ID          int64  `json:"id,string" datastore:"-"`
	UserID      int64  `json:"userId,string"`
	ParentID    int64  `json:"parentId,string" datastore:",noindex"`
	PrevID      int64  `json:"prevId,string" datastore:",oindex"`
	NextID      int64  `json:"nextId,string" datastore:",oindex"`
	Name        string `json:"name" datastore:",noindex"`
	RecommendId string `json:"recommendId" datastore:",noindex"`
}
