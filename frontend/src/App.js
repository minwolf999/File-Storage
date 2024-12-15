import './index.css';
import Save from './Components/Save.js'
import Get from './Components/Get.js'
import Update from './Components/Update.js'
import Delete from './Components/Delete.js'

import { useState } from 'react';

export default function App() {
  const [selectOption, setSelectOption] = useState('')
  const handleChange = (e) => {
    setSelectOption(e.target.value)
  }

  return (
  <>
    <div className="flex flex-col items-center p-6 bg-gray-800 min-h-screen text-white">
      <label
        className='mb-4 text-xl font-semibold text-center'
        htmlFor='action-select'
      >
        What do you want to do ?
      </label>

      <select
        id='action-select'
        className='mb-6 w-full max-w-md px-4 py-3 rounded-lg bg-gray-700 text-lg font-medium text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer'
        value={selectOption}
        onChange={handleChange}
      >
        <option value={''}></option>
        <option value={'Save'}>Save</option>
        <option value={'Get'}>Get</option>
        <option value={'Update'}>Update</option>
        <option value={'Delete'}>Delete</option>
      </select>

      {selectOption === 'Save' && <Save />}
      {selectOption === 'Get' && <Get />}
      {selectOption === 'Update' && <Update />}
      {selectOption === 'Delete' && <Delete />}
    </div>
  </>
  );
}
