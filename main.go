package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"file_storage/FileAction"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// Open the database
	db, err := sql.Open("sqlite3", "./Database/database.sqlite")
	if err != nil {
		log.Println(err)
		return
	}

// Handle the logic request
retry:
	// Ask the type of Logic the user want to use
	fmt.Println("Do you want to get a file or save a file ? [G / S]")
	// Get the choice of the user
	file_action_choice, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil {
		log.Println(err)
		return
	}
	// Replace stray characters
	file_action_choice = strings.TrimSpace(file_action_choice)

	// Check the logic chosen by the user (S to save | G to get) and if the user sent an invalid character, we retry the request
	if strings.ToLower(file_action_choice) == "s" {
		FileAction.SaveFile(db)
	} else if strings.ToLower(file_action_choice) == "g" {
		FileAction.GetFile(db)
	} else {
		fmt.Println("Invalid Input !")
		goto retry
	}
}
