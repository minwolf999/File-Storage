# File Storage Program

This Go program allows users to store files in a database and retrieve files from the database. The program uses SQLite as the database backend and stores files as blobs. It provides the functionality to save files with unique IDs and retrieve them based on their filenames.
Features

    Save a file: Upload a file to the database with a unique ID and metadata (filename and extension).

    Get a file: Retrieve a file from the database by specifying the filename, and save it to the local filesystem.

## Requirements

    Go 1.18 or later
    SQLite database (SQLite3)
    The following Go packages:
        github.com/mattn/go-sqlite3 (SQLite driver)
        github.com/gofrs/uuid (for generating UUIDs)

## Setup Instructions

- Install Go (if not installed): Follow the instructions at https://golang.org/doc/install to install Go.

- Clone this repository:
``` bash
    git clone https://github.com/minwolf999/File-Storage.git
    cd File-Storage
```

- Install dependencies: Run the following command to install required Go packages:
```bash
    go get github.com/mattn/go-sqlite3
    go get github.com/gofrs/uuid
```

- Database setup: Make sure you have an SQLite database set up. The program expects the database to be located at ./Database/database.sqlite. You may need to create the necessary table for storing files. Below is an example SQL script to create the required table:
```sql
    CREATE TABLE IF NOT EXISTS Storage (
        Id TEXT NOT NULL PRIMARY KEY,
        FileName TEXT NOT NULL,
        File BLOB NOT NULL,
        Extension TEXT NOT NULL
    );
```

- Directory setup: Ensure that an output directory exists in the project root where files will be retrieved and saved. You can create it manually or let the program create it on file retrieval.

## Usage
### Running the Program

To run the program, execute the following command in the project directory:
```bash
    go run main.go
```

### The program will prompt you to choose an action:

- Save a file: Upload a file to the database.
- Get a file: Retrieve a file from the database.

### Actions

- Save a file:
        You will be prompted to enter the path of the file you wish to save.
        The file is stored in the database as a blob with a unique ID, and its filename and extension are stored as metadata.

    Example prompt:
```
    Do you want to get a file or save a file? [G / S]
    What file do you want to save?
```

- Retrieve a file:

    You will be prompted to enter the filename (case insensitive) of the file you want to retrieve.
    The program fetches the file from the database and saves it to the output directory.

    Example prompt:
```
    Do you want to get a file or save a file? [G / S]
    What file do you want to get?
```

## Code Explanation
1. main.go

    The main.go file serves as the entry point of the application. It connects to the SQLite database and allows the user to choose between saving a file or retrieving one.

    - Database connection: The program establishes a connection to the SQLite database (./Database/database.sqlite) and ensures foreign keys are enabled for integrity.
    - User Interaction: The program continuously prompts the user to either save or retrieve a file, and calls the appropriate function from the FileAction package.

2. SaveFile(db *sql.DB)

    This function allows users to save a file to the SQLite database.

    - Input: The user provides the file path.
    - UUID generation: A unique UUID is generated for the file.
    - Database insertion: The file content is read into memory and inserted into the database as a blob, along with its filename and extension.

3. GetFile(db *sql.DB)

    This function retrieves a file from the database by filename and saves it to the local filesystem.

    - Input: The user provides the filename.
    - Database query: The function queries the Storage table for the file's metadata and content.
    - File saving: The retrieved file is saved to the output/ directory with its original extension.

4. File Structure

    - main.go: The main entry point, handles user input and calls the FileAction functions.
    - FileAction/SaveFile.go: Contains the logic for saving a file to the database.
    - FileAction/GetFile.go: Contains the logic for retrieving a file from the database.

## Example Use Cases

- Saving a File:
    When you choose to save a file, the program will ask you to specify a file path, save it to the database, and provide a success message.
- Retrieving a File:
    When retrieving a file, you can enter the filename (case insensitive), and the program will save it to the output/ directory with its original extension.

## Notes

- File Size: This program reads the entire file into memory, which may cause memory issues for very large files. Consider optimizing for large files if needed (e.g., streaming file data in chunks).
- Error Handling: The program provides error messages for common issues such as invalid file paths, missing files, or database errors.

## License

This project is licensed under the MIT License - see the LICENSE file for details.