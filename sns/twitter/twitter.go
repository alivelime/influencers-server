package twitter

import (
	"context"
	"encoding/base64"
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

func getLoginCallbackURL() string {
	return os.Getenv("AUTH_LOGIN_CALLBACK_URL")
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
		return "parse auth callback error.", err
	}

	cache, err := memcache.Get(ctx, prefixTwitterRequest+requestToken)
	if err != nil {
		return "request token not found.", err
	}

	accessToken, accessSecret, err := config.AccessToken(requestToken, string(cache.Value), verifier)
	if err != nil {
		return "access token error.", err
	}

	token := oauth1.NewToken(accessToken, accessSecret)

	memcache.Delete(ctx, prefixTwitterRequest+requestToken)
	memcache.Set(ctx, &memcache.Item{Key: prefixTwitterToken + accessToken, Value: []byte(accessSecret)})

	var redirectTo string
	cache, err = memcache.Get(ctx, prefixLoginRedirectURL+requestToken)
	if err != nil {
		redirectTo = base64.StdEncoding.EncodeToString([]byte(getRedirectDefaultURL()))
	} else {
		// cache value is base64 encoded.
		redirectTo = string(cache.Value)
	}

	url := getLoginCallbackURL() + "/token/" + accessToken + "/redirect/" + redirectTo

	return url, nil
}

func GetVerify(r *http.Request, token string) (session.User, error) {
	cache, err := memcache.Get(ctx, prefixTwitterToken+token)
	if err != nil {
		return NewError("access secret not found.", err)
	}

	token := oauth1.NewToken(accessToken, string(cache.Value))
	httpClient := config.Client(ctx, token)

	client = lib.NewClient(httpClient)
	user, _, err := client.Accounts.VerifyCredentials(nil)
	if err != nil {
		return NewError("twitter verify credentails failed..", err)
	}

	return data
}
