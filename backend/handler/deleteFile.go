package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

func DeleteFile(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var fileName string
		if err := json.NewDecoder(r.Body).Decode(&fileName); err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		stmt, err := db.Prepare("DELETE FROM Storage WHERE Id = ?")
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		if _, err = stmt.Exec(fileName); err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(map[string]any{
			"Success": true,
			"Message": "The file has been deleted of the DB",
		})
		if err != nil {
			log.Println(err.Error())
		}
	}
}
