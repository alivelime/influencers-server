package twitter

import (
	"context"
	"encoding/base64"
	"errors"
	"net/http"
	"os"
	"strings"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"

	lib "github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	endpoint "github.com/dghubble/oauth1/twitter"

	"github.com/alivelime/influs/sessions"
)

type User struct {
	ID        int64
	Type      string
	Follower  int64
	URL       string
	Name      string
	Avatar    string
	Image     string
	Color     string
	Followers int
}

var config oauth1.Config

const (
	Twitter                = "twitter"
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

	sessions.SetCache(ctx, prefixTwitterRequest+requestToken, requestSecret)
	if len(redirectTo) > 0 {
		sessions.SetCache(ctx, prefixLoginRedirectURL+requestToken, redirectTo)
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

	requestSecret, err := sessions.GetCache(ctx, prefixTwitterRequest+requestToken)
	if err != nil {
		return "request token not found.", err
	}

	accessToken, accessSecret, err := config.AccessToken(requestToken, requestSecret, verifier)
	if err != nil {
		return "access token error.", err
	}

	sessions.Set(ctx, sessions.Session{
		SNSType: Twitter,
		Token:   prefixTwitterToken + accessToken,
		Secret:  accessSecret,
	})

	var redirectTo string
	redirecTo, err = sessions.GetCache(ctx, prefixLoginRedirectURL+requestToken)
	if err != nil {
		redirectTo = base64.StdEncoding.EncodeToString([]byte(getRedirectDefaultURL()))
	}

	url := getLoginCallbackURL() +
		"/sns/" + "twitter" +
		"/token/" + prefixTwitterToken + accessToken +
		"/redirect/" + redirectTo

	return url, nil
}

func GetVerify(r *http.Request, accessToken string, secret string) (User, error) {
	var ret User
	ctx := appengine.NewContext(r)

	newCtx := context.WithValue(ctx, oauth1.HTTPClient, urlfetch.Client(ctx))
	token := oauth1.NewToken(strings.TrimLeft(accessToken, prefixTwitterToken), secret)
	httpClient := config.Client(newCtx, token)

	client := lib.NewClient(httpClient)
	user, _, err := client.Accounts.VerifyCredentials(nil)
	if err != nil {
		return ret, errors.New("twitter verify credentails failed.." + err.Error())
	}

	ret.ID = user.ID // this means sns id
	ret.Type = Twitter
	ret.Name = user.Name + "@" + user.ScreenName
	ret.Avatar = user.ProfileImageURLHttps
	ret.Image = user.ProfileBannerURL
	ret.Color = user.ProfileBackgroundColor
	ret.URL = "https://www.twitter.com/" + user.ScreenName
	ret.Followers = user.FollowersCount

	return ret, nil
}
