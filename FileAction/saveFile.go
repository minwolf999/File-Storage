package FileAction

import (
	"bufio"
	"database/sql"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofrs/uuid"
)

// This function Handle the logic to save a file in the DB
func SaveFile(db *sql.DB) {
	// Ask the name of the file the user want to get
	fmt.Println("What file do you want to save ?")

	// Get the path of the file the user wants to save
	filePath, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil {
		log.Println(err)
		return
	}
	// Replace stray characters
	filePath = strings.TrimSpace(filePath)
	filePath = strings.Trim(filePath, `"'`)

	// Open the file give by the user
	file, err := os.Open(filePath)
	if err != nil {
		log.Println(err)
		return
	}
	defer file.Close()

	// Generate an id for the new line in the DB
	uid, err := uuid.NewV7()
	if err != nil {
		log.Println(err)
		return
	}

	// Store in variables the id generated, the name of the file (without the extension), the extension of the file
	id := uid.String()
	nameFile := strings.ToLower(strings.TrimSuffix(filepath.Base(filepath.Base(filePath)), filepath.Ext(filepath.Base(filePath))))
	extension := filepath.Ext(filePath)

	// Retrieve binary data from the file
	blob, err := io.ReadAll(file)
	if err != nil {
		log.Println(err)
		return
	}

	// Save the data obtained in the DB
	_, err = db.Exec("INSERT INTO Storage VALUES(?,?,?,?)", id, nameFile, blob, extension)
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println("File saved in the Database")
}
