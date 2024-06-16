import React, { useState } from 'react'
import TaskForm from '../components/TaskForm'
import { useParams } from 'react-router-dom'
import TaskCard from '../../../components/ui/Cards/TaskCard'

const TasksSection = (props) => {
  const { course } = useParams()
  const [openAddTask, setOpenAddTask] = useState(false)

  const handleTaskModal = () => {
    setOpenAddTask(!openAddTask)
  }

  return (
    <>
      {!openAddTask && props.role === 'teacher' && (
        <div
          className="border-dashed border-2 p-5 text-center text-gray-500 
        hover:text-indigo-500 hover:border-indigo-300 cursor-pointer"
          onClick={handleTaskModal}>
          + Створити завдання
        </div>
      )}

      {openAddTask && props.role === 'teacher' && <TaskForm courseId={course} close={handleTaskModal} groups={props.groups} />}

      {props.tasks?.tasks && props.tasks?.tasks.map((task, index) => <TaskCard key={index} task={task} course={course} />)}
    </>
  )
}

export default TasksSection
