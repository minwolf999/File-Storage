import '../index.css'
import { useState, useEffect } from 'react'

export default function Delete() {
    const [fileNames, setFileNames] = useState([])
    const [selectedFileName, setSelectedFileName] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        fetch('http://localhost:8001/getFileNames', {
            method: 'POST'
        }).then(async response => {
            if (response.ok) {
                setFileNames(await response.json())
            }
        })
    })

    const confirmDelete = () => {
        fetch('http://localhost:8001/deleteFile', {
            method: 'POST',
            body: JSON.stringify(selectedFileName),
        })
        
        setSelectedFileName('')
        setShowConfirm(false)
    }

    const cancelDelete = () => {
        document.getElementById('file-select').selectedIndex = 0
        setShowConfirm(false)
    }

    const handleChange = (e) => {
        setSelectedFileName(e.target.value)
        if (e.target.value !== '') {
            setShowConfirm(true)
        } else {
            setShowConfirm(false)
        }
    }

    return (
    <>
        <label
            htmlFor='file-select'
            className='mb-4 text-xl font-semibold text-center'
        >
            Select the file you want to delete
        </label>

        <select
            onChange={handleChange}
            id='file-select'
            className='mb-6 w-full max-w-md px-4 py-3 rounded-lg bg-gray-700 text-lg font-medium text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer'
        >
            <option></option>
            {fileNames && fileNames.Value && fileNames.Value.length > 0 &&
                fileNames.Value.map((fileName, index) => (
                    <option 
                        value={ fileName.Id }
                        key={ index }
                    >
                        { fileName.FileName }
                    </option>
                ))
            }
        </select>

        {showConfirm &&
            <div>
                <p
                    className='mb-4 text-xl font-semibold text-center'
                >
                    Are you sure you want to delete the file '{ fileNames.Value.map(file => (
                        file.FileName
                    )) }' ?
                </p>
                    
                <div className='flex justify-evenly w-full'>

                    <button
                        className='text-xl bg-white text-green-500 pr-2 pl-2 rounded-lg font-semibold'
                        onClick={ confirmDelete }
                    >
                        Yes
                    </button>

                    <button
                        className='text-xl bg-white text-red-500 pr-2 pl-2 rounded-lg font-semibold'
                        onClick={ cancelDelete }
                    >
                        No
                    </button>
                </div>
            </div>
        }
    </>
    )
}