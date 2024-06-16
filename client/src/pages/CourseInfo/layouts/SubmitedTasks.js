import React, { useEffect, useState } from 'react'
import TaskForm from '../components/TaskForm'
import { useParams } from 'react-router-dom'
import TaskCard from '../../../components/ui/Cards/TaskCard'
import { getSubmitedTasks } from '../../../api/tasks'
import SubmitedTask from '../../../components/ui/Cards/SubmitedTask'
import ContainerDefault from '../../../components/ui/Containers/ContainerDefault'

const SubmitedTasks = (props) => {
  const { course } = useParams()
  const [openAddTask, setOpenAddTask] = useState(false)
  const [submitedTasks, setSubmitedTasks] = useState([])

  const handleTaskModal = () => {
    setOpenAddTask(!openAddTask)
  }

  useEffect(() => {
    const fetchSubmitedTasks = async () => {
      const response = await getSubmitedTasks(course)
      setSubmitedTasks(response)
    }

    fetchSubmitedTasks()
  }, [])

  return (
    <>{submitedTasks && submitedTasks.map((task, index) => <SubmitedTask key={index} task={task} course={course} />)}</>
  )
}

export default SubmitedTasks
