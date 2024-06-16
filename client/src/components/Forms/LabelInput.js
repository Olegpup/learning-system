import React from 'react'

export default function LabelInput({ label, name, value, id, placeholder, type, required, setValue }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="email" className="text-gray-600 text-sm">
        {label}
      </label>
      <input
        name={name}
        value={value}
        id={id}
        placeholder={placeholder}
        type={type}
        className="bg-transparent w-full border-slate-200 border-b p-2 
        disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none 
        focus:border-black focus:outline-none focus:text-black"
        required={required}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
