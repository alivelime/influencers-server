package twitter

import (
	"context"
	"net/http"
	"os"

	"google.golang.org/appengine"
	"google.golang.org/appengine/memcache"
	"google.golang.org/appengine/urlfetch"

	lib "github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	endpoint "github.com/dghubble/oauth1/twitter"
)

var config oauth1.Config

const (
	prefixTwitterRequest   = "TwitterRequest"
	prefixTwitterToken     = "TwitterToken"
	prefixLoginRedirectURL = "Redirect"
)

func getConsumerKey() string {
	return os.Getenv("AUTH_TWITTER_CONSUMER_KEY")
}
func getConsumerSecret() string {
	return os.Getenv("AUTH_TWITTER_CONSUMER_SECRET_KEY")
}
func getCallbackURL() string {
	return os.Getenv("AUTH_TWITTER_CALLBACK_URL")
}
func getRedirectDefaultURL() string {
	return os.Getenv("AUTH_LOGIN_REDIRECT_DEFAULT_URL")
}

type Client struct {
	client      lib.Client
	AccessToken string
	RedirectTo  string
}

func init() {
	config = oauth1.Config{
		ConsumerKey:    getConsumerKey(),
		ConsumerSecret: getConsumerSecret(),
		CallbackURL:    getCallbackURL(),
		Endpoint:       endpoint.AuthorizeEndpoint,
	}

}

func GetAuthURL(ctx context.Context, redirectTo string) (string, error) {
	http.DefaultClient.Transport = &urlfetch.Transport{Context: ctx}

	requestToken, requestSecret, err := config.RequestToken()
	if err != nil {
		return "", err
	}

	memcache.Set(ctx, &memcache.Item{Key: prefixTwitterRequest + requestToken, Value: []byte(requestSecret)})
	if len(redirectTo) > 0 {
		memcache.Set(ctx, &memcache.Item{Key: prefixLoginRedirectURL + requestToken, Value: []byte(redirectTo)})
	}
	authorizationURL, err := config.AuthorizationURL(requestToken)
	if err != nil {
		return "", err
	}

	return authorizationURL.String(), nil
}

func GetCallbackURL(r *http.Request) (string, error) {
	ctx := appengine.NewContext(r)
	http.DefaultClient.Transport = &urlfetch.Transport{Context: ctx}

	requestToken, verifier, err := oauth1.ParseAuthorizationCallback(r)
	if err != nil {
		return "a", err
	}

	cache, err := memcache.Get(ctx, prefixTwitterRequest+requestToken)
	if err != nil {
		return "b", err
	}

	accessToken, accessSecret, err := config.AccessToken(requestToken, string(cache.Value), verifier)
	if err != nil {
		return "c", err
	}

	token := oauth1.NewToken(accessToken, accessSecret)
	httpClient := config.Client(ctx, token)

	_ = lib.NewClient(httpClient)

	memcache.Delete(ctx, prefixTwitterRequest+requestToken)
	memcache.Set(ctx, &memcache.Item{Key: prefixTwitterToken + accessToken, Value: []byte(accessSecret)})

	var redirectTo string
	cache, err = memcache.Get(ctx, prefixLoginRedirectURL+requestToken)
	if err != nil {
		redirectTo = getRedirectDefaultURL()
	} else {
		redirectTo = string(cache.Value)
	}

	url := redirectTo + "/token/" + accessToken

	return url, nil
}
