package recommendbranches

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine/datastore"
)

const Kind = "RecommendBranch"

func Get(ctx context.Context, id int64) (recommendBranch RecommendBranch, err error) {
	key := datastore.NewKey(ctx, Kind, "", id, nil)

	if err = datastore.Get(ctx, key, &recommendBranch); err != nil {
		return
	}

	recommendBranch.ID = id
	return
}

func Put(ctx context.Context, recommendBranch *RecommendBranch) error {
	key := datastore.NewKey(ctx, Kind, "", recommendBranch.ID, nil)
	k, err := datastore.Put(ctx, key, recommendBranch)
	if err != nil {
		return err
	}

	recommendBranch.ID = k.IntID()
	return nil
}

func GetUserRecommendBranches(ctx context.Context, userId int64) (map[int64]RecommendBranch, error) {
	query := datastore.NewQuery(Kind).Filter("UserID =", userId)

	recommendBranches := make(map[int64]RecommendBranch)
	itr := query.Run(ctx)

	for {
		var recommendBranch RecommendBranch
		key, err := itr.Next(&recommendBranch)
		if err == datastore.Done {
			break
		}
		if err != nil {
			errors.New(fmt.Sprintf("unable datastore %s", err))
			return nil, err
		}

		recommendBranch.ID = key.IntID()
		recommendBranches[key.IntID()] = recommendBranch
	}

	return recommendBranches, nil
}

func Delete(ctx context.Context, id int64) error {
	key := datastore.NewKey(ctx, Kind, "", id, nil)
	if err := datastore.Delete(ctx, key); err != nil {
		return errors.New(fmt.Sprintf("unable delete recommend branch.%d %s", id, err))
	}
	return nil
}
