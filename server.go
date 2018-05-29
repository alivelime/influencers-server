/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/user"

	"github/alivelime/influs/api"
)

func init() {

	http.HandleFunc("/api/persons", api.HandlePersons)
	http.HandleFunc("/api/recommends", api.HandleRecommends)
	log.Println("Server started: http://localhost:")
}

// guestbookKey returns the key used for all guestbook entries.
func guestbookKey(c context.Context) *datastore.Key {
	// The string "default_guestbook" here could be varied to have multiple guestbooks.
	return datastore.NewKey(c, "Guestbook", "default_guestbook", 0, nil)
}

// Handle comments
func handleComments(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	q := datastore.NewQuery("comment").Ancestor(guestbookKey(c)).Order("-Date").Limit(10)

	comments := make([]comment, 0, 10)
	if _, err := q.GetAll(c, &comments); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case "POST":
		//To allocate slice for request body
		length, err := strconv.Atoi(r.Header.Get("Content-Length"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Read body data to parse json
		body := make([]byte, length)
		length, err = r.Body.Read(body)
		if err != nil && err != io.EOF {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//parse json
		var param comment
		err = json.Unmarshal(body[:length], &param)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		author := ""
		if u := user.Current(c); u != nil {
			author = u.String()
		}

		key := datastore.NewIncompleteKey(c, "comment", guestbookKey(c))
		data := comment{ID: time.Now().UnixNano() / 1000000, Author: author, Text: param.Text}
		_, err = datastore.Put(c, key, &data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// Marshal the comments to indented json.
		commentData, err := json.Marshal(comments)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		io.Copy(w, bytes.NewReader(commentData))

	case "GET":
		log.Printf("%+v", comments)

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Marshal the comments to indented json.
		commentData, err := json.Marshal(comments)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to marshal comments to json: %s", err), http.StatusInternalServerError)
			return
		}
		// stream the contents of the file to the response
		io.Copy(w, bytes.NewReader(commentData))

	default:
		// Don't know the method, so error
		http.Error(w, fmt.Sprintf("Unsupported method: %s", r.Method), http.StatusMethodNotAllowed)
	}
}
