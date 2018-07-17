package affiliate

import (
	"context"
	"net/http"

	"github.com/alivelime/influs/model/affiliates"
)

type Tag struct {
	Amazonjp string
	Iherbjp  string
}

const NoTag = Tag{}

func GetSystemTag() Tag {
	return Tag{
		Amazonjp: os.Getenv("AWS_ASSOCIATE_TAG"),
		Iherbjp:  os.Getenv("IHERB_AFFILIATE_TAG"),
	}
}

func GetUserTag(ctx context.Context, userId int64) Tag {
	if userId == 0 {
		return GetSystemTag()
	}

	tag, err := model.Get(ctx, userId)
	if err != nil {
		return GetSystemTag()
	}

	return Tag{
		Amazonjp: tag.Amazonjp,
		IHerbjp:  tag.Iherbjp,
	}
}
