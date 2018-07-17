package recommends

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
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
	key := datastore.NewKey(ctx, Kind, id, 0, nil)
	k, err := datastore.Put(ctx, key, recommend)
	if err != nil {
		return err
	}

	return nil
}

func GetRecommendsByUserID(ctx context.Context, userID int64) (map[string]Recommend, error) {
}
