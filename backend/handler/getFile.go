package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

func GetFileNames(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		stmt, err := db.Prepare("SELECT Id, FileName FROM Storage")
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		rows, err := stmt.Query()
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		var fileNames []struct {
			Id       string `json:"Id"`
			FileName string `json:"FileName"`
		}
		for rows.Next() {
			var fileName struct {
				Id       string `json:"Id"`
				FileName string `json:"FileName"`
			}
			err = rows.Scan(&fileName.Id, &fileName.FileName)
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(map[string]any{
					"Error":   http.StatusText(http.StatusUnauthorized),
					"Message": err.Error(),
				})

				return
			}

			fileNames = append(fileNames, fileName)
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(map[string]any{
			"Success": true,
			"Message": "File names have been recovered.",
			"Value":   fileNames,
		})
		if err != nil {
			log.Println(err.Error())
		}
	}
}

func GetFile(db *sql.DB) http.HandlerFunc {
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

		stmt, err := db.Prepare("SELECT * FROM Storage WHERE Id = ?")
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"Error":   http.StatusText(http.StatusUnauthorized),
				"Message": err.Error(),
			})

			return
		}

		var fileData struct {
			Id        string `json:"Id"`
			FileName  string `json:"FileName"`
			Blob      string `json:"Blob"`
		}
		if err = stmt.QueryRow(fileName).Scan(&fileData.Id, &fileData.FileName, &fileData.Blob); err != nil {
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
			"Message": "File datas have been recovered.",
			"Value":   fileData,
		})
		if err != nil {
			log.Println(err.Error())
		}
	}
}
