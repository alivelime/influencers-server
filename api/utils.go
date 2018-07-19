package api

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func getPathParamInt64(w http.ResponseWriter, r *http.Request, name string) (int64, bool) {
	str, ok := mux.Vars(r)[name]
	if !ok {
		http.Error(w, fmt.Sprintf("Unable read %d from path.", name), http.StatusBadRequest)
		return 0, false
	}

	p, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable read %d from path. %s", name, err), http.StatusBadRequest)
		return 0, false
	}
	return p, true
}

func getPathParamString(w http.ResponseWriter, r *http.Request, name string, must bool) (string, bool) {
	str, ok := mux.Vars(r)[name]
	if !ok && must {
		http.Error(w, fmt.Sprintf("Unable read %s from path.", name), http.StatusBadRequest)
		return "", false
	}
	return str, true
}

func getPathParamBase64(w http.ResponseWriter, r *http.Request, name string) (string, bool) {
	b, err := base64.StdEncoding.DecodeString(mux.Vars(r)[name])
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to decode base64 url : %s", err), http.StatusInternalServerError)
		return "", false
	}

	return string(b), true
}

func readParam(w http.ResponseWriter, r *http.Request, to interface{}) bool {

	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		http.Error(w, fmt.Sprintf("unable read body  %s", err), http.StatusInternalServerError)
		return false
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &to); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return false
	}

	return true
}

func response(w http.ResponseWriter, param interface{}) {
	res, err := json.Marshal(param)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal %#v to json: %s", param, err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}
