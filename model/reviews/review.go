package reviews

import (
	"context"
	"errors"
	"fmt"
	"time"

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
func Get(ctx context.Context, id int64) (review Review, err error) {
	review, err = get(ctx, id)

	// TODO temp implement. delete later. use REST API instead.
	if review.IineID != 0 {
		respect, _ := get(ctx, review.IineID)
		review.IineUserID = respect.UserID
	}
	return
}

func Put(ctx context.Context, review *Review) error {
	key := datastore.NewKey(ctx, Kind, "", review.ID, nil)

	review.CreatedAt = time.Now()

	k, err := datastore.Put(ctx, key, review)
	if err != nil {
		return err
	}

	// TODO temp implement. delete later. use REST API instead.
	if review.IineID != 0 {
		respect, _ := get(ctx, review.IineID)
		review.IineUserID = respect.UserID
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

func GetUserReviews(ctx context.Context, userId int64) (map[int64]*Review, error) {
	var ret map[int64]*Review

	// SELECT * FROM Reviews WHERE UserID = 'userId' ORDER BY createdAt
	query := datastore.NewQuery(Kind).Filter("UserID =", userId)
	count, err := query.Count(ctx)
	if err != nil {
		return ret, errors.New(fmt.Sprintf("unable query count  %s", err))
	}

	// do not use GetALL. Because it has 1000 limit.
	ret = make(map[int64]*Review, count)
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

	for id, review := range ret {
		review.IineCount = getIineCount(ctx, id)

		// TODO temp implement. delete later. use REST API instead.
		if review.IineID != 0 {
			respect, _ := get(ctx, review.IineID)
			review.IineUserID = respect.UserID
		}
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
