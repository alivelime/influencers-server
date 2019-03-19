package recommends

import (
	"context"
	"errors"
	"fmt"
	"sync"

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

	wg := sync.WaitGroup{}
	mutex := &sync.Mutex{}

	// loop by 1000 keys. because GetMulit is limited by 1000.
	affiliateTag := affiliate.GetUserTag(ctx, userId)
	const limit = 100
	for i := 0; len(keys) > i; i += limit {
		end := i + limit
		if len(keys) < end {
			end = len(keys)
		}

		wg.Add(1)
		go func(tempKeys []*datastore.Key, count int) {
			defer wg.Done()
			tempRecommends := make([]Recommend, count)
			if err := datastore.GetMulti(ctx, tempKeys, tempRecommends); err != nil {
				merr, ok := err.(appengine.MultiError)
				if !ok {
					{
						mutex.Lock()
						defer mutex.Unlock()
						err = errors.New(fmt.Sprintf("Unable to GetMulti Recommend A: %s", err))
					}
					return
				}

				for _, e := range merr {
					if e == nil {
						// exists
						continue
					}

					if e == datastore.ErrNoSuchEntity {
						// return ret, errors.New(fmt.Sprintf("no such id %s", e))
						// empty
						continue
					}

					{
						mutex.Lock()
						defer mutex.Unlock()
						err = errors.New(fmt.Sprintf("Unable to GetMulti Recommend: %s", e))
					}
					return
				}
			}
			// id and affiliate tag.
			{
				mutex.Lock()
				defer mutex.Unlock()
				for k, v := range tempKeys {
					web := site.Factory(v.StringID(), affiliateTag)
					tempRecommends[k].URL = v.StringID()
					tempRecommends[k].Link = web.GetAffiliateLink()
					ret[v.StringID()] = tempRecommends[k]
				}
			}
		}(keys[i:end], end-i)
	}
	if len(keys) > 0 {
		wg.Wait()
	}

	return ret, err
}
