package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/auth"
	"github.com/alivelime/influs/model/users"
	"github.com/alivelime/influs/sessions"
	"github.com/alivelime/influs/sns/twitter"
)

func getTwitterAuth(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	// redirectTo is base64 encoded. but no need to decode.
	redirectTo := mux.Vars(r)["to"]
	url, err := twitter.GetAuthURL(ctx, redirectTo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter: %s", err), http.StatusInternalServerError)
	}

	http.Redirect(w, r, url, http.StatusFound)
}

func getTwitterCallback(w http.ResponseWriter, r *http.Request) {
	url, err := twitter.GetCallbackURL(r)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter callback: %s ,%s", url, err), http.StatusInternalServerError)
	}
	http.Redirect(w, r, url, http.StatusFound)
}

func getTwitterVerify(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		http.Error(w, "secret token not found.", http.StatusUnauthorized)
		return
	}

	twitterUser, err := twitter.GetVerify(r, session.Token, session.Secret)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter token: ,%s", err), http.StatusInternalServerError)
		return
	}

	// check if user registration.
	user, err := users.GetUserBySNSID(ctx, twitterUser.ID, twitterUser.Type)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var ret User
	if user != nil {
		ret = *user
	}
	ret.SNSID = twitterUser.ID
	ret.SNSType = twitterUser.Type
	ret.Name = twitterUser.Name
	ret.Avatar = twitterUser.Avatar
	ret.Image = twitterUser.Image
	ret.Color = twitterUser.Color
	ret.SNSURL = twitterUser.URL
	ret.SNSPower = twitterUser.Followers

	sessions.Set(ctx, sessions.Session{
		User:   ret,
		Token:  token,
		Secret: secret,
	})

	response(w, ret)
}

func twitterRegister(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	session, ok := auth.CheckLogin(w, r)
	if !ok {
		http.Error(w, "secret token not found.", http.StatusUnauthorized)
		return
	}

	// check if user registration.
	{
		user, err := users.GetUserBySNSID(ctx, session.User.SNSID, session.User.SNSType)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if user != nil {
			http.Error(w, fmt.Sprintf("user %d has already registerd.", user.ID), http.StatusForbidden)
			return
		}
	}

	user := session.User
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	if err := users.Put(ctx, &user); err != nil {
		http.Error(w, fmt.Sprintf("unable put datastore  %s", err), http.StatusInternalServerError)
		return
	}

	session.User = user
	sessions.Set(ctx, session)
	resposen(w, user)
}

func HandleTwitterAuth(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getTwitterAuth(w, r)

	case "POST":
		fallthrough
	case "PUT":
		fallthrough
	case "PATCH":
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleTwitterCallback(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getTwitterCallback(w, r)

	case "POST":
		fallthrough
	case "PUT":
		fallthrough
	case "PATCH":
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleTwitterVerify(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getTwitterVerify(w, r)

	case "POST":
		fallthrough
	case "PUT":
		fallthrough
	case "PATCH":
		fallthrough
	default:
		http.Error(w, fmt.Sprintf("No impliment method %s", r.Method), http.StatusInternalServerError)
	}
}

func HandleTwitterRegister(w http.ResponseWriter, r *http.Request) {
	twitterRegister(w, r)
}
