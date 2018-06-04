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
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/alivelime/influs/api"
)

func init() {
	r := mux.NewRouter()

	r.HandleFunc("/api/users", api.HandleUsers)
	r.HandleFunc("/api/users/{id}", api.HandleUser)
	r.HandleFunc("/api/recommend-branches", api.HandleRecommendBranches)
	r.HandleFunc("/api/recommend-branches/{id}", api.HandleRecommendBranch)
	r.HandleFunc("/api/users/{userId}/recommend-branches", api.HandleUserRecommendBranches)
	http.Handle("/", r)

	log.Println("Server started: http://localhost:")
}