import React from 'react'
import { Link } from 'react-router-dom'
import { ViewIcon } from '../../../assets/icons/view'
import { TrashIcon } from '../../../assets/icons/trash'
import { StudentListCard } from './StudentListCard'

const GroupDetails = ({ group, handleDelete, role }) => {
  return (
    <div key={group.group_id}>
      <div className="border-b border-indigo-300 text-indigo-500 dark:text-slate-400 flex justify-between">
        <div className="flex gap-2 items-baseline">
          <span>{group.group_title}</span>
          <span className="text-sm text-slate-600">
            Вчитель: {group.teacher_first_name} {group.teacher_last_name} {group.teacher_father_name}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {role === 'teacher' && (
            <Link to={`/groups/${group.group_id}`}>
              <ViewIcon className="w-7 h-7 text-slate-500 hover:text-indigo-600" />
            </Link>
          )}
          {role === 'teacher' && handleDelete && (
            <button className="text-slate-500" onClick={() => handleDelete(group.group_id)}>
              <TrashIcon className="w-5 h-5 text-slate-500 hover:text-indigo-600" />
            </button>
          )}
        </div>
      </div>
      <div className="pt-4 pb-7 flex flex-col gap-2">
        {group.students && group.students.length > 0 ? (
          group.students.map((student, index) => <StudentListCard student={student} key={index} />)
        ) : (
          <p className="text-gray-700">В группі немає жодного учня</p>
        )}
      </div>
    </div>
  )
}

export default GroupDetails
