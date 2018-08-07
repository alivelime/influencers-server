package sessions

import (
	"context"
	"encoding/json"
	"time"

	"google.golang.org/appengine/memcache"

	"github.com/alivelime/influs/model/users"
)

type Session struct {
	User   users.User
	Token  string
	Secret string
}

func Set(ctx context.Context, s Session) {
	str, _ := json.Marshal(s)
	memcache.Set(ctx, &memcache.Item{
		Key:        s.Token,
		Value:      []byte(str),
		Expiration: time.Duration(1440) * time.Minute,
	})
}
func Get(ctx context.Context, token string) (Session, error) {
	var s Session
	cache, err := memcache.Get(ctx, token)
	if err != nil {
		return s, err
	}
	err = json.Unmarshal(cache.Value, &s)
	return s, err
}

func DeleteCache(ctx context.Context, key string) {
	memcache.Delete(ctx, key)
}
func SetCache(ctx context.Context, key string, value string) {
	memcache.Set(ctx, &memcache.Item{
		Key:        key,
		Value:      []byte(value),
		Expiration: time.Duration(1440) * time.Minute,
	})
}
func GetCache(ctx context.Context, key string) (string, error) {
	cache, err := memcache.Get(ctx, key)
	if err != nil {
		return "", err
	}
	return string(cache.Value), nil
}
