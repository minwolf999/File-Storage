import '../index.css'

import { useState, useEffect } from 'react';
import { uuidv7 } from 'uuidv7';

const dbError = {
    // General Errors
    "unable to open database file": "We encountered an issue opening the database file. Please try again later.",
    "database is locked": "The database is currently locked. Please try again later.",
    "authentication failed": "Authentication failed. Please check your credentials.",
    "no such table: <table_name>": "The requested table does not exist. Please check the table name.",
    "no such column: <column_name>": "The requested column does not exist in the table. Please check the column name.",
    "syntax error": "There is a syntax error in the query. Please check the query structure.",
    "too many SQL variables": "The query contains too many variables. Please reduce the number of variables.",
    "disk I/O error": "An error occurred while reading or writing to the disk. Please try again later.",
    "database is full": "The database is full. Please free up some space and try again.",
    "out of memory": "The operation ran out of memory. Please try again with less data.",
    "operational error": "An operational error occurred. Please try again later.",
    "permission denied": "You do not have permission to perform this operation. Please check your access rights.",

    // Errors During SELECT
    "no such table: Storage": "The 'Storage' table does not exist. Please check the table name.",
    "no such column: FileName": "The 'FileName' column does not exist in the 'Storage' table.",
    "ambiguous column name: <column_name>": "The column name is ambiguous. Please specify the table.",
    "invalid column name: <column_name>": "The specified column name is invalid. Please check the column name.",
    "unknown error": "An unknown error occurred. Please try again later.",
    "unable to fetch row": "Unable to fetch the requested data. Please try again later.",

    // Errors During INSERT
    "UNIQUE constraint failed: Storage.FileName": "The file name already exists. Please choose a different name.",
    "UNIQUE constraint failed: Storage.Id": "The ID already exists. Please provide a unique ID.",
    "NOT NULL constraint failed: Storage.FileName": "The file name is required and cannot be empty.",
    "NOT NULL constraint failed: Storage.Extension": "The file extension is required and cannot be empty.",
    "NOT NULL constraint failed: Storage.Blob": "The file data (BLOB) is required and cannot be empty.",
    "datatype mismatch": "The data type does not match the expected type. Please check the data.",
    "constraint failed": "A constraint violation occurred. Please check the data and constraints.",
    "check constraint failed: Storage": "A check constraint failed for the 'Storage' table. Please verify the data.",

    // Errors During UPDATE
    "PRIMARY KEY must be unique": "The primary key must be unique. Please ensure the key is not duplicated.",

    // Errors During DELETE
    "foreign key constraint failed": "Unable to delete due to a foreign key constraint violation.",
    "no such row": "The row to be deleted does not exist.",

    // Transaction Errors
    "deadlock detected": "A deadlock was detected. Please try the operation again.",
    "lock timeout": "The operation timed out while waiting for a lock. Please try again later.",
    "cannot rollback transaction": "Unable to roll back the transaction. Please try again later.",
    "transaction is busy": "The transaction is currently busy. Please try again later.",

    // Schema Errors
    "table Storage already exists": "The 'Storage' table already exists.",
    "column <column_name> already exists": "The specified column already exists in the table.",
    "ALTER TABLE failed": "There was an error modifying the table. Please check the table schema.",
    "cannot add foreign key constraint": "Unable to add the foreign key constraint. Please check the table structure.",

    // Miscellaneous Errors
    "quota exceeded": "The quota has been exceeded. Please reduce the data size or free up space.",
    "BLOB too large": "The BLOB data is too large. Please reduce the file size.",

    // JSON Errors
    "invalid character 'x' looking for beginning of value": "Invalid character encountered in the JSON input.",
    "EOF": "Unexpected end of input while parsing the JSON data.",
    "unexpected end of JSON input": "The JSON data is incomplete.",
    "json: cannot unmarshal <type> into Go struct field <field>": "Unable to parse the JSON into the specified type. Please check the structure.",
    "json: cannot unmarshal string into Go struct field <field> of type <type>": "Expected a different data type in the JSON input. Please verify the structure.",
    "json: invalid use of ,string struct tag": "Invalid usage of struct tags in the JSON structure.",
    "json: unknown field <field_name> in struct": "The JSON contains an unexpected field. Please check the structure.",
    "json: cannot unmarshal <value> into Go value of type <type>": "Unable to parse the value into the specified type.",
    "invalid character '<char>' after top-level value": "Unexpected character found after the root JSON value.",
    "unexpected token": "An unexpected token was encountered while parsing the JSON.",
    "malformed JSON input": "The JSON input is malformed or invalid.",
    "field '<field_name>' is required but missing": "A required field is missing from the JSON input.",
    "http: request body too large": "The request body is too large. Please reduce the size and try again.",
    "http: invalid Content-Type": "The request content type is invalid. Expected 'application/json'.",
    "request body already read": "The request body has already been consumed.",
    "invalid or missing JSON body": "The JSON body is either missing or malformed.",
}


export default function Save() {
    const [file, setFile] = useState(null);
    const [id, setId] = useState('')
    const [fileName, setFileName] = useState('')
    const [blob, setBlob] = useState('')

    const [fetchData, setFetchData] = useState(null)
    const [formattedMessage, setFormattedMessage] = useState('')
    
    function handleChange (e) {
        setFile(e.target.files[0]);
    };
    
    useEffect(() => {
        if (file) {
            const split = file.name.split('.')
            split.pop()



            setId(uuidv7());
            setFileName(split.join('.'));

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                setBlob(reader.result)
            };
        }
    }, [file]);

    
    useEffect(() => {
        if (id && fileName && blob) {
            fetch('http://localhost:8001/saveFile', {
                method: 'POST',
                body: JSON.stringify({
                    Id: id,
                    FileName: fileName,
                    Blob: blob
                }),
            }).then(async response => {
                if (response.ok) {
                    setFetchData(await response.json())
                }
            })
        }
    }, [id, fileName, blob]);
        
    useEffect(() => {
        if (fetchData && fetchData.Success) {
            setFormattedMessage(fetchData.Message)
        } else if (fetchData && fetchData.Error){
            if (dbError[fetchData.Message] === "") {
                setFormattedMessage("The error isn't handle for the moment please contact an administrator")
            } else {
                setFormattedMessage(dbError[fetchData.Message])
            }
        }
    }, [fetchData])

    return (
    <>
        {fetchData && fetchData.Success &&
            <div
                className='mb-4 text-xl font-semibold text-center text-green-500'
            >
                {formattedMessage}
            </div>
        }

        {fetchData && fetchData.Error &&
            <div
                className='mb-4 text-xl font-semibold text-center text-red-500'
            >
                {formattedMessage}
            </div>
        }

        <label
            className='mb-4 text-xl font-semibold text-center'
            htmlFor='file-select'
        >
            What file do you want to save ?
        </label>

        <input
            type='file'
            onChange={handleChange}
        />
    </>
    )
}