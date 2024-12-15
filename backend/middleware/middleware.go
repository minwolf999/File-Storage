package middleware

import (
	"encoding/json"
	"net/http"
)

/*
This function takes 1 argument:
  - a http.Handler named next, which represents the next handler to be called in the middleware chain.

The purpose of this function is to set the necessary HTTP headers to enable Cross-Origin Resource Sharing (CORS) for incoming requests.

The function returns a new http.Handler that applies the CORS headers before passing control to the next handler.

The CORS headers set include:
  - Access-Control-Allow-Origin: allows requests from any origin.
  - Access-Control-Allow-Methods: allows POST and OPTIONS methods.
  - Access-Control-Allow-Headers: allows the Content-Type header.
*/
func SetHeaderAccessControll(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers to allow cross-origin requests
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Call the next handler in the chain
		next.ServeHTTP(w, r)
	})
}

/*
This function takes 1 argument:
  - a http.Handler named next, which represents the next handler to be called in the middleware chain.

The purpose of this function is to inspect the HTTP request method and handle requests accordingly.

The function returns a new http.Handler that checks if the request is a WebSocket upgrade or a POST request. If the method is neither, it logs an error and returns an error response.

The behavior of the function is as follows:
  - If the "Upgrade" header indicates a WebSocket connection, the next handler is called.
  - If the request method is POST, the next handler is also called.
  - If the method is neither WebSocket nor POST, an error is logged, and an error response is sent back.
*/
func LookMethod(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the request method is POST
		if r.Method == http.MethodPost {
			next.ServeHTTP(w, r) // Call the next handler for POST requests
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"Error":   http.StatusText(http.StatusUnauthorized),
			"Message": "Invalid Method",
		})
	})
}
