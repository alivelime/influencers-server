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
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"google.golang.org/appengine"

	"github.com/alivelime/influs/api"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/users", api.HandleUsers)
	r.HandleFunc("/api/users/{id}", api.HandleUser)
	r.HandleFunc("/api/users/{id}/leave", api.HandleUserLeave)

	r.HandleFunc("/api/recommend-branches", api.HandleRecommendBranches)
	r.HandleFunc("/api/recommend-branches/{id}", api.HandleRecommendBranch)

	r.HandleFunc("/api/users/{userId}/recommend-branches", api.HandleUserRecommendBranches)
	r.HandleFunc("/api/users/{userId}/recommends", api.HandleUserRecommends)
	r.HandleFunc("/api/users/{userId}/reviews", api.HandleUserReviews)
	r.HandleFunc("/api/users/{userId}/affiliate", api.HandleUserAffiliate)
	r.HandleFunc("/api/users/{userId}/timeline", api.HandleUserTimeline)
	r.HandleFunc("/api/users/{userId}/follows", api.HandleUserFollows)
	r.HandleFunc("/api/users/{userId}/followers", api.HandleUserFollowers)
	r.HandleFunc("/api/users/{i}/follows/{u}", api.HandleUserFollows)

	r.HandleFunc("/api/meta/{id:.+}", api.HandleMeta)
	r.HandleFunc("/api/recommends", api.HandleRecommends)
	r.HandleFunc("/api/recommends/{id:.+}", api.HandleRecommend)

	r.HandleFunc("/api/reviews", api.HandleReviews)
	r.HandleFunc("/api/reviews/{id}", api.HandleReview)

	r.HandleFunc("/api/twitter/auth", api.HandleTwitterAuth)
	r.HandleFunc("/api/twitter/auth/redirect/{to:.+}", api.HandleTwitterAuth)
	r.HandleFunc("/api/twitter/callback", api.HandleTwitterCallback)
	r.HandleFunc("/api/twitter/verify", api.HandleTwitterVerify)
	r.HandleFunc("/api/twitter/register", api.HandleTwitterRegister)
	http.Handle("/", handlers.CORS(
		handlers.AllowCredentials(),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Content-Length", "Authenticate"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"}),
		handlers.AllowedOriginValidator(func(_ string) bool { return true }),
	)(r))

	appengine.Main()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
}
