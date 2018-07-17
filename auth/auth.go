package auth

import (
	"net/http"
	"os"
	"strings"

	"google.golang.org/appengine"
	"google.golang.org/appengine/memcache"
)

func getAdminKey() string {
	return os.Getenv("AUTH_ADMIN_KEY")
}

// follow RFC6750
func CheckLogin(w http.ResponseWriter, r *http.Request) (ok bool, token string, secret string) {
	ctx := appengine.NewContext(r)

	// check header.
	scheme := r.Header.Get("Authenticate")
	if len(scheme) == 0 {
		w.Header().Set("WWW-Authenticate", "Bearer realm=\"\"")
		http.Error(w, "no Authenticat header.e", http.StatusUnauthorized)
		return
	}
	if !strings.Contains(scheme, "Bearer ") {
		http.Error(w, "Authenticate header error.", http.StatusBadRequest)
		return
	}

	// check token exists
	token = strings.TrimLeft(scheme, "Bearer ")
	if len(token) == 0 {
		http.Error(w, "Authenticate header error.", http.StatusUnauthorized)
		return
	}

	// check token is enable
	cache, err := memcache.Get(ctx, token)
	if err != nil {
		http.Error(w, "secret token not found.", http.StatusUnauthorized)
		return false, "", ""
	}

	ok = true
	secret = string(cache.Value)
	return
}

func CheckAdmin(w http.ResponseWriter, r *http.Request) (ok bool, token string) {
	ctx := appengine.NewContext(r)

	// check header.
	scheme := r.Header.Get("Authenticate")
	if len(scheme) == 0 {
		w.Header().Set("WWW-Authenticate", "Bearer realm=\"\"")
		http.Error(w, "no Authenticat header.e", http.StatusUnauthorized)
		return
	}
	if !strings.Contains(scheme, "Bearer ") {
		http.Error(w, "Authenticate header error.", http.StatusBadRequest)
		return
	}

	// check token exists
	token = strings.TrimLeft(scheme, "Bearer ")
	if len(token) == 0 {
		http.Error(w, "Authenticate header error.", http.StatusUnauthorized)
		return
	}

	// check token is enable
	if token != getAdminKey() {
		http.Error(w, "Admin only.", http.StatusUnauthorized)
		return false, "", ""
	}

	ok = true
	secret = string(cache.Value)
	return
}
