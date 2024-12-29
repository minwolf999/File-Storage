package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3"

	"backend/middleware"
	"backend/handler"
)

func main() {
	mux := http.NewServeMux()

	db, err := sql.Open("sqlite3", "./database/database.sqlite")
	if err != nil {
		log.Println(err)
		return
	}

	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		log.Println(err)
		return
	}

	mux.Handle("/saveFile", handler.SaveFile(db))
	mux.Handle("/getFileNames", handler.GetFileNames(db))
	mux.Handle("/getFile", handler.GetFile(db))
	mux.Handle("/updateFile", handler.UpdateFile(db))
	mux.Handle("/deleteFile", handler.DeleteFile(db))

	handler := middleware.SetHeaderAccessControll(
		middleware.LookMethod(mux),
	)

	srv := &http.Server{
		Handler:      handler,
		Addr:         "0.0.0.0:8001",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	log.Println("Starting server at http://" + srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("Error starting TLS server: %v", err)
	}
}
