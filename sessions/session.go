package sessions

import (
	"encoding/json"

	"google.golang.org/appengine/memcache"

	"github.com/alivelime/influs/model/users"
)

type Session struct {
	User   users.User
	Token  string
	Secret string
}

func Set(s session.Session) {
	str, _ := json.Marshal(s)
	memcache.Set(ctx, &memcache.Item{
		Key:        s.Token,
		Value:      []byte(str),
		Expiration: time.Duration(1440) * time.Minute,
	})
}
func Get(token string) (session.Session, error) {
	var s session.Session
	cache, err := memcache.Get(ctx, token)
	if err != nil {
		return s, err
	}
	err = json.Unmarshal(string(str.Value), &s)
	return s, err
}

func SetCache(ctx, key string, value string) {
	memcache.Set(ctx, &memcache.Item{
		Key:        key,
		Value:      []byte(value),
		Expiration: time.Duration(5) * time.Minute,
	})
}
func GetCache(ctx context.Context, key string) (string, err) {
	cache, err := memcache.Get(ctx, key)
	return string(cache.Value), err
}
