package recommendbranches

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine"
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

func GetRecommendBranchesByUserID(ctx context.Context, userID int64) (map[int64]RecommendBranch, error) {
	// SELECT * FROM RecommendBranches WHERE UserID = 'userId' ORDER BY Priority
	// do not use 'priority prop and sort' but use link list. because link list is better than priotiry sort.
	query := datastore.NewQuery(Kind).Filter("UserID =", userId)
	count, err := query.Count(ctx)
	if err != nil {
		errors.New(fmt.Sprintf("unable query count  %s", err))
		return nil, err
	}

	// do not use GetALL. Because it has 1000 limit.
	recommendBranches = make(map[int64]RecommendBranch, count)
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
