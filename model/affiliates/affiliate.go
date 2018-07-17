package affiliates

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

const Kind = "Affiliate"

func Get(ctx context.Context, userId int64) (affiliate Affiliate, err error) {
	key := datastore.NewKey(ctx, Kind, "", id, nil)

	if err = datastore.Get(ctx, key, &affiliate); err != nil {
		return
	}

	affiliate.UserID = userId
	return
}

func Put(ctx context.Context, affiliate *Affiliate) error {
	if affiliate.UserID == 0 {
		return errors.New("validation error. Affiliate needs UserID")
	}

	key := datastore.NewKey(ctx, Kind, "", affiliate.UserID, nil)
	_, err := datastore.Put(ctx, key, affiliate)
	if err != nil {
		return err
	}

	return nil
}
