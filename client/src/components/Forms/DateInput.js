import React from 'react'
import { CalendarIcon } from '../../assets/icons/calendar'

const DateInput = ({ value, setValue }) => {
  return (
    <div className="relative max-w-sm">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <CalendarIcon classNameName={'w-4 h-4 text-gray-500'} />
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 
        focus:ring-blue-500 focus:border-blue-500 
       "
        placeholder="Select date"
      />
    </div>
  )
}

export default DateInput
