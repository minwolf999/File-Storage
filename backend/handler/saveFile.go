package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

func SaveFile(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var fileData struct {
			Id       string `json:"Id"`
			FileName string `json:"FileName"`
			Blob     string `json:"Blob"`
		}

		if err := json.NewDecoder(r.Body).Decode(&fileData); err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		stmt, err := db.Prepare("INSERT INTO Storage VALUES(?,?,?)")
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		_, err = stmt.Exec(fileData.Id, fileData.FileName, fileData.Blob)
		if err != nil {
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
			"Message": "The file has been stored in the DB",
		})
		if err != nil {
			log.Println(err.Error())
		}
	}
}
