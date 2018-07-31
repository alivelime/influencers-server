package timelines

import "time"

type Timeline struct {
	I         int64     `json:"i,string"`
	U         int64     `json:"u,string"`
	Event     EventType `json:"event,string" datastore:",noindex"`
	What      int64     `json:"what,string" datastore:",noindex"`
	CreatedAt time.Time `json:"createdAt"`
}

type EventType int

const (
	Iiyo EventType = iota
	Iine
	Follow
)

func (c EventType) String() string {
	switch c {
	case Iiyo:
		return "Iiyo"
	case Iine:
		return "Iine"
	case Follow:
		return "Follow"
	default:
		return "Unknown"
	}
}
