package sns

type SNSType int

const (
	Twitter SNSType = iota
	Facebook
)

func (t SNSType) String() string {
	switch t {
	case Twitter:
		return "Twitter"
	case Facebook:
		return "Facebook"
	default:
		return "Unknown"
	}
}
