package follows

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

const Kind = "Follow"

func PostFromUserID(ctx context.Context, i int64, u int64) error {
	if i == 0 || u == 0 {
		return errors.New("validation error. follow needs UserID.")
	}

	key := datastore.NewIncompleteKey(ctx, Kind, nil)
	_, err := datastore.Put(ctx, key, &Follow{I: i, U: u})
	if err != nil {
		return err
	}

	return nil
}

func DeleteFromUserID(ctx context.Context, i int64, u int64) error {

	// SELECT * FROM follows WHERE I = 'userId'
	query := datastore.NewQuery(Kind).Filter("I =", i)

	// do not use GetALL. Because it has 1000 limit.
	itr := query.Run(ctx)

	for {
		var follow Follow
		key, err := itr.Next(&follow)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return errors.New(fmt.Sprintf("unable datastore %s", err))
		}

		if follow.U == u {
			if err := datastore.Delete(ctx, key); err != nil {
				return err
			}
		}
	}

	return nil
}

func GetMyFollows(ctx context.Context, userId int64) (followIds []int64, err error) {
	return getFollows(ctx, "I", userId)
}
func GetMyFollowers(ctx context.Context, userId int64) (followIds []int64, err error) {
	return getFollows(ctx, "U", userId)
}
func getFollows(ctx context.Context, key string, userId int64) ([]int64, error) {

	// SELECT * FROM follows WHERE I = 'userId'
	query := datastore.NewQuery(Kind).Filter(key+" =", userId)
	count, err := query.Count(ctx)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("unable query count  %s", err))
	}

	// do not use GetALL. Because it has 1000 limit.
	ids := make([]int64, 0, count) // warn if size is not set zero, ids become [0,0,0,... newId, newId2..]
	itr := query.Run(ctx)

	for {
		var follow Follow
		_, err := itr.Next(&follow)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return nil, errors.New(fmt.Sprintf("unable datastore %s", err))
		}

		if key == "I" {
			ids = append(ids, follow.U)
		} else {
			ids = append(ids, follow.I)
		}
	}

	log.Infof(ctx, "%#v", ids)
	return ids, nil
}
