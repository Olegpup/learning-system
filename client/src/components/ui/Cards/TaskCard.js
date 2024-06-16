import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FileBadge from '../Badges/FileBadge'
import { TaskIcon } from '../../../assets/icons/task'
import { formatDateString } from '../../../utils/formatDateString'
import { GroupsIcon } from '../../../assets/icons/groups'

const TaskCard = ({ task, course }) => {
  const navigate = useNavigate()
  const handleOnClick = () => {
    navigate(`/courses/${course}/task/${task?.task_id}/`)
  }
  return (
    <div onClick={handleOnClick}>
      <div
        className="my-2 p-4 py-6 border border-gray-200 rounded-md bg-white hover:border-indigo-300 cursor-pointer 
      ease-in-out duration-300 transition-colors ">
        <div className="flex gap-4 items-center">
          <div
            className={`h-10 w-10 rounded-full  ${
              task.is_completed ? 'bg-indigo-200' : 'bg-indigo-500'
            } flex justify-center items-center`}>
            {task.task_type === 'individual' ? (
              <TaskIcon className={'w-6 h-6 text-white'} />
            ) : (
              <GroupsIcon className={'w-6 h-6 text-white'} />
            )}
          </div>
          <div>
            <p className="text-lg">Завдання: {task.title}</p>
            <p className="text-xs text-gray-400">{formatDateString(task.publish_date)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pl-14 mt-3">
          {task?.files &&
            task.files.map((taskFile, fileIndex) => (
              <FileBadge key={fileIndex} link={taskFile.file_url} caption={taskFile.caption} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
