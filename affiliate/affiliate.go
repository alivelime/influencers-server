package affiliate

import (
	"context"
	"os"

	model "github.com/alivelime/influs/model/affiliates"
)

type Tag struct {
	Amazonjp string
	Iherbjp  string
}

var NoTag = Tag{}

func GetSystemTag() Tag {
	return Tag{
		Amazonjp: os.Getenv("AWS_ASSOCIATE_TAG"),
		Iherbjp:  os.Getenv("IHERB_AFFILIATE_TAG"),
	}
}

func GetUserTag(ctx context.Context, userId int64) Tag {
	defaultTag := GetSystemTag()
	if userId == 0 {
		return defaultTag
	}

	tag, err := model.Get(ctx, userId)
	if err != nil {
		return defaultTag
	}

	var ret Tag
	if len(tag.Amazonjp) == 0 {
		ret.Amazonjp = defaultTag.Amazonjp
	} else {
		ret.Amazonjp = tag.Amazonjp
	}
	if len(tag.Iherbjp) == 0 {
		ret.Iherbjp = defaultTag.Iherbjp
	} else {
		ret.Iherbjp = tag.Iherbjp
	}
	return ret
}
