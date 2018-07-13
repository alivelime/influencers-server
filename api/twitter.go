package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"

	"github.com/alivelime/influs/auth"
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

	ok, token, secret := auth.CheckLogin(w, r)
	if !ok {
		return
	}

	data, err := twitter.GetVerify(r, token, secret)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot auth twitter token: ,%s", err), http.StatusInternalServerError)
		return
	}

	// check if user registration.
	user, err := getUserFromSNSID(ctx, data.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var snsUser SNSUser
	snsUser.ID = data.ID
	snsUser.Name = data.Name
	snsUser.Avator = data.Avator
	snsUser.Image = data.Image
	if user != nil {
		snsUser.UserID = user.ID
	}

	res, err := json.Marshal(snsUser)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal session verify: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))

}

func getUserFromSNSID(ctx context.Context, snsID int64) (*User, error) {
	// SELECT * FROM Users WHERE SNSID = 'snsID'
	query := datastore.NewQuery("User").Filter("SNSID =", snsID)
	count, err := query.Count(ctx)
	if err != nil {
		return nil, errors.New("Unable query count. " + err.Error())
	}
	if count == 0 {
		return nil, nil
	}

	var user User
	itr := query.Run(ctx)

	for {
		var user User
		key, err := itr.Next(&user)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		user.ID = key.IntID()
	}

	return &user, nil
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
