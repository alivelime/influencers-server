package api

import (
	"bytes"
	"encoding/json"
	"io"
	"io/util"
	"net/http"

	"github.com/gorilla/mux"
)

func getPathParamInt64(w http.ResponseWritor, r *http.Request, name string) (int64, ok) {
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

func getPathParamString(w http.ResponseWrittor, r *http.Request, name string) (string, ok) {
	str, ok := mux.Vars(r)[name]
	if !ok {
		http.Error(w, fmt.Sprintf("Unable read %d from path.", name), http.StatusBadRequest)
		return "", false
	}
	return str, true
}

func getPathParamBase64(w http.ResponseWrittor, r *http.Request, name string) (string, ok) {
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
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &recommendBranch); err != nil {
		http.Error(w, fmt.Sprintf("unable unmarshal json  %s", err), http.StatusInternalServerError)
		return
	}

	return true
}

func response(w http.ResponseWritor, param interface{}) {
	res, err := json.Marshal(user)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to marshal %#v to json: %s", param, err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	io.Copy(w, bytes.NewReader(res))
}
