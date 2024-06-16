import React from 'react'
import { Link } from 'react-router-dom'
import { TaskIcon } from '../../../assets/icons/task'
import { formatDateString } from '../../../utils/formatDateString'

const SubmitedTask = ({ task, course }) => {
  return (
    <Link to={`/courses/${course}/submited-task/${task?.complete_task_id}/`}>
      <div
        className="my-2 p-4 py-6 border border-gray-200 rounded-md bg-white hover:border-indigo-300 cursor-pointer 
      ease-in-out duration-300 transition-colors ">
        <div className="flex gap-4 items-center">
          <div
            className={`h-10 w-10 rounded-full  ${
              task.rate > 0 ? 'bg-indigo-200' : 'bg-indigo-500'
            } flex justify-center items-center`}>
            <TaskIcon className={'w-6 h-6 text-white'} />
          </div>
          <div>
            <p className="text-lg">Учень надіслав завдання на перевірку: {task.task_title}</p>
            <p className="text-xs text-gray-400">{task.student_last_name} {task.student_first_name} {task.student_father_name} {formatDateString(task.sended_date)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SubmitedTask
