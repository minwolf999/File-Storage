import '../index.css'
import { useState, useEffect } from 'react'

export default function Get() {
    const [fileNames, setFileNames] = useState([])
    const [selectedFileName, setSelectedFileName] = useState('')

    useEffect(() => {
        fetch('http://localhost:8001/getFileNames', {
            method: 'POST'
        }).then(async response => {
            if (response.ok) {
                setFileNames(await response.json())
            }
        })
    })

    useEffect(() => {
        if (selectedFileName !== "") {
            const fetchFile = async() => {
                const fileData = await fetch('http://localhost:8001/getFile', {
                    method: 'POST',
                    body: JSON.stringify(selectedFileName),
                }).then(async response => {
                    if (response.ok) {
                        return await response.json()
                    }
                })

                var link=document.createElement('a');
                link.download = fileData.Value.FileName
                link.href = fileData.Value.Blob;
                link.click();
            }

            fetchFile()
        }
    }, [selectedFileName])

    const handleChange = (e) => {
        setSelectedFileName(e.target.value)
    }   

    return (
    <>
        <label
            htmlFor='file-select'
            className='mb-4 text-xl font-semibold text-center'
        >
            Select the file you want to get
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
                        key={index}
                    >
                        { fileName.FileName }
                    </option>
                ))
            }
        </select>
    </>
    )
}