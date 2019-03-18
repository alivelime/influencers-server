package reviews

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine/datastore"
)

const Kind = "Review"

func get(ctx context.Context, id int64) (review Review, err error) {
	key := datastore.NewKey(ctx, Kind, "", id, nil)

	if err = datastore.Get(ctx, key, &review); err != nil {
		return
	}

	review.ID = id
	return
}
func Get(ctx context.Context, id int64) (Review, error) {
	return get(ctx, id)
}

func Put(ctx context.Context, review *Review) error {
	key := datastore.NewKey(ctx, Kind, "", review.ID, nil)

	k, err := datastore.Put(ctx, key, review)
	if err != nil {
		return err
	}

	review.ID = k.IntID()
	return nil
}

func Delete(ctx context.Context, id int64) error {
	key := datastore.NewKey(ctx, Kind, "", id, nil)
	if err := datastore.Delete(ctx, key); err != nil {
		return errors.New(fmt.Sprintf("unable delete review. %s", err))
	}
	return nil
}

func IncrementIine(ctx context.Context, id int64) error {
	review, err := Get(ctx, id)
	if err != nil {
		return err
	}

	review.IineCount += 1

	err = Put(ctx, &review)
	if err != nil {
		return err
	}

	return nil
}
func GetUserReviews(ctx context.Context, userId int64) (map[int64]*Review, error) {
	query := datastore.NewQuery(Kind).Filter("UserID =", userId)

	// do not use GetALL. Because it has 1000 limit.
	ret := make(map[int64]*Review)
	itr := query.Run(ctx)

	for {
		var review Review
		key, err := itr.Next(&review)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return ret, errors.New(fmt.Sprintf("unable datastore %s", err))
		}

		review.ID = key.IntID()
		ret[review.ID] = &review
	}

	return ret, nil
}

func getIineCount(ctx context.Context, id int64) int {
	query := datastore.NewQuery(Kind).Filter("IineID =", id)
	count, err := query.Count(ctx)
	if err != nil {
		return -1
	}
	return count
}
