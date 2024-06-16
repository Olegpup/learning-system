import React from 'react'

const LabelTextarea = ({ label, value, setValue, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor="description" className="text-sm text-gray-600 ">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="border px-2 py-3
        focus:outline-none focus:border focus:border-b-black "></textarea>
  </div>
)

export default LabelTextarea
