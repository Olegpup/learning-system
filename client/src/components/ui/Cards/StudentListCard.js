import React from 'react'
import DefaultBadge from '../Badges/DefaultBadge'

export const StudentListCard = ({ student }) => (
  <div className="flex gap-2 items-baseline">
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 uppercase font-bold text-indigo-400">{student.first_name.substring(0,1)}</div>
    <div>{student.last_name}</div>
    <div>{student.first_name}</div>
    <div>{student.father_name}</div>
    {/* <div className="text-gray-500 text-sm">{student.email}</div> */}
  </div>
)
