package timelines

import (
	"context"
	"errors"

	"google.golang.org/appengine/datastore"
)

const Kind = "Timeline"

func Put(ctx context.Context, timeline *Timeline) error {
	if timeline.I == 0 {
		return errors.New("validation error. timeline needs UserID")
	}

	key := datastore.NewIncompleteKey(ctx, Kind, nil)
	_, err := datastore.Put(ctx, key, timeline)
	if err != nil {
		return err
	}

	return nil
}

func GetUserTimeline(ctx context.Context, userId int64) (i []Timeline, me []Timeline, err error) {

	// timeline of what i do.
	i, err = getTimelines(ctx, userId, "I")
	if err != nil {
		return
	}
	// timeline of what somebody do to me.
	me, err = getTimelines(ctx, userId, "U")
	if err != nil {
		return
	}

	return
}

func getTimelines(ctx context.Context, userId int64, key string) (ret []Timeline, err error) {

	// SELECT * FROM Timelines WHERE I = 'userId' ORDER BY createdAt Limit 50
	query := datastore.NewQuery(Kind).Filter(key+" =", userId).Order("-CreatedAt").Limit(50)
	_, err = query.GetAll(ctx, &ret)
	return
}
