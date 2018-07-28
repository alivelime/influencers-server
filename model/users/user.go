package users

import (
	"context"
	"errors"
	"time"

	"google.golang.org/appengine/datastore"
)

const Kind = "User"

func Get(ctx context.Context, id int64) (user User, err error) {
	key := datastore.NewKey(ctx, Kind, "", id, nil)

	if err = datastore.Get(ctx, key, &user); err != nil {
		return
	}

	user.ID = id
	return
}

func Put(ctx context.Context, user *User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	key := datastore.NewKey(ctx, Kind, "", user.ID, nil)
	k, err := datastore.Put(ctx, key, user)
	if err != nil {
		return err
	}

	user.ID = k.IntID()
	return nil
}

func GetUserBySNSID(ctx context.Context, snsID int64, snsType string) (User, error) {
	var ret User

	// SELECT * FROM Users WHERE SNSID = 'snsID' and SNSType = 'snsType'
	query := datastore.NewQuery(Kind).Filter("SNSID =", snsID)
	count, err := query.Count(ctx)
	if err != nil {
		return ret, errors.New("Unable query count. " + err.Error())
	}
	if count == 0 {
		return ret, nil
	}

	itr := query.Run(ctx)

	for {
		var user User
		key, err := itr.Next(&user)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return ret, err
		}

		if snsType == user.SNSType {
			user.ID = key.IntID()
			ret = user
		}
	}

	return ret, nil
}

func IncrementIiyo(ctx context.Context, id int64) error {
	user, err := Get(ctx, id)
	if err != nil {
		return err
	}

	user.IiyoCount += 1

	err = Put(ctx, &user)
	if err != nil {
		return err
	}

	return nil
}
func IncrementIine(ctx context.Context, id int64) error {
	user, err := Get(ctx, id)
	if err != nil {
		return err
	}

	user.IineCount += 1

	err = Put(ctx, &user)
	if err != nil {
		return err
	}

	return nil
}
func IncrementInflu(ctx context.Context, id int64) error {
	user, err := Get(ctx, id)
	if err != nil {
		return err
	}

	user.InfluCount += 1

	err = Put(ctx, &user)
	if err != nil {
		return err
	}

	return nil
}
