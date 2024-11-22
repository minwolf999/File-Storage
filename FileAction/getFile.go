package FileAction

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
)

// This structure is similar of the table in the DB
type File struct {
	Id        string `json:"Id"`
	FileName  string `json:"FileName"`
	File      []byte `json:"File"`
	Extension string `json:"Extensions"`
}

// This function Handle the logic to get and recreate a file from the DB
func GetFile(db *sql.DB) {
	// Ask the name of the file the user want to get
	fmt.Print("What file do you want to get? ")

	// Get the name of the file wanted by the user
	fileName, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil {
		log.Println("Error reading input:", err)
		return
	}
	// Replace stray characters
	fileName = strings.ToLower(strings.TrimSpace(fileName))

	// Get the data of the files stored in the DB
	var file File
	query := "SELECT Id, FileName, File, Extension FROM Storage WHERE FileName = ?"
	if err = db.QueryRow(query, fileName).Scan(&file.Id, &file.FileName, &file.File, &file.Extension); err != nil {
		log.Println("Error retrieving file:", err)
		return
	}

	// Recreate the file from the data get in the Output folder
	outputPath := "output/" + file.FileName + file.Extension
	if err = os.WriteFile(outputPath, file.File, 0666); err != nil {
		log.Println("Error writing file:", err)
		return
	}

	fmt.Println("File saved to:", outputPath)
}
