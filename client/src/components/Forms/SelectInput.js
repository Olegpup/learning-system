import React from 'react'

const SelectInput = ({options, value, setValue}) => {
  return (
    <select
      id="countries"
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      {options.length > 0 && options.map((item, index) => (<option value={item.value} key={index}>{item.title}</option>)
      )}
    </select>
  )
}

export default SelectInput