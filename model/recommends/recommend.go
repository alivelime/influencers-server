package recommends

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/affiliate"
	"github.com/alivelime/influs/model/reviews"
	"github.com/alivelime/influs/site"
)

const Kind = "Recommend"

func Get(ctx context.Context, id string) (recommend Recommend, err error) {
	key := datastore.NewKey(ctx, Kind, id, 0, nil)

	if err = datastore.Get(ctx, key, &recommend); err != nil {
		return
	}

	recommend.URL = id
	return
}

func Put(ctx context.Context, recommend *Recommend) error {
	key := datastore.NewKey(ctx, Kind, recommend.URL, 0, nil)
	_, err := datastore.Put(ctx, key, recommend)
	if err != nil {
		return err
	}

	return nil
}

func GetUserRecommends(ctx context.Context, userId int64) (map[string]Recommend, error) {

	// SELECT * FROM Recommens INNER JOIN Reviews ON recommendId WHERE UserId = 'userId' GROUP BY recommendId
	ret := map[string]Recommend{}

	// group by recommendId
	recommendIds := map[string]bool{} // recommendIds["url"]
	userReviews, err := reviews.GetUserReviews(ctx, userId)
	if err != nil {
		return ret, errors.New(fmt.Sprintf("Unable to Get User Reviews: %d %s", userId, err))
	}
	for _, v := range userReviews {
		recommendIds[v.RecommendID] = true
		if len(v.Evidence) > 0 {
			recommendIds[v.Evidence] = true
		}
	}

	keys := make([]*datastore.Key, len(recommendIds))
	{
		i := 0
		for id, _ := range recommendIds {
			keys[i] = datastore.NewKey(ctx, Kind, id, 0, nil)
			i++
		}
	}

	tempRecommends := make([]Recommend, len(recommendIds))
	if err := datastore.GetMulti(ctx, keys, tempRecommends); err != nil {
		merr, ok := err.(appengine.MultiError)
		if !ok {
			return ret, errors.New(fmt.Sprintf("Unable to GetMulti Recommend A: %s", err))
		}

		for _, e := range merr {
			if e == nil {
				// exists
				continue
			}

			if e == datastore.ErrNoSuchEntity {
				// empty
				continue
			}

			return ret, errors.New(fmt.Sprintf("Unable to GetMulti Recommend: %s", err))
		}

	}

	// id and affiliate tag.
	affiliateTag := affiliate.GetUserTag(ctx, userId)
	for k, v := range keys {
		if tempRecommends[k].Kind != "" {
			web := site.Factory(v.StringID(), affiliateTag)
			tempRecommends[k].URL = v.StringID()
			tempRecommends[k].Link = web.GetAffiliateLink()
			ret[v.StringID()] = tempRecommends[k]
		}
	}
	return ret, nil
}
