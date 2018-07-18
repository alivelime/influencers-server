package reviews

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

const Kind = "Review"

func Get(ctx context.Context, id int64) (review Review, err error) {
	key := datastore.NewKey(ctx, Kind, "", id, nil)

	if err = datastore.Get(ctx, key, &review); err != nil {
		return
	}

	review.ID = id
	return
}

func Put(ctx context.Context, review *Review) error {
	key := datastore.NewKey(ctx, Kind, "", review.ID, nil)

	review.CreatedAt = time.Now()

	k, err := datastore.Put(ctx, key, review)
	if err != nil {
		return err
	}

	review.ID = k.IntID()
	return nil
}

func Delete(ctx context.Context, id int64) error {
	key := datastore.NewKey(ctx, "Review", "", id, nil)
	if err := datastore.Delete(ctx, key); err != nil {
		http.Error(w, fmt.Sprintf("unable delete review. %s", err), http.StatusNotFound)
		return
	}
}

func GetUserReviews(ctx context.Context, userID int64) (map[int64]Review, error) {
	var ret map[int64]Review

	// SELECT * FROM Reviews WHERE UserID = 'userId' ORDER BY createdAt
	query := datastore.NewQuery("Review").Filter("UserID =", userId)
	count, err := query.Count(ctx)
	if err != nil {
		return ret, errors.New(fmt.Sprintf("unable query count  %s", err))
	}

	// do not use GetALL. Because it has 1000 limit.
	ret = make(map[int64]Review, count)
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
		ret[review.ID] = review
	}

	return ret, nil
}
