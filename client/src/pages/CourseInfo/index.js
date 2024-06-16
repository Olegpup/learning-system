import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { getCourseInfo, deleteGroupFromCourse, deleteCourse } from '../../api/courses'
// import { deleteTask } from '../../api/tasks'
import { getTasks } from '../../api/tasks'

import TasksSection from './layouts/TasksSection'
import GroupSection from './layouts/GroupSection'
import SettingsSection from './layouts/SettingsSection'
import SubmitedTasks from './layouts/SubmitedTasks'

import SideNavigation from './components/SideNavigation'

import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import CourseHeader from './components/CourseHeader'
import MainHeader from '../../components/ui/Headers/MainHeader'

function CourseInfo() {
  const navigate = useNavigate()
  const { course } = useParams()
  const [statusMessage, setStatusMessage] = useState('')
  const [mode, setMode] = useState('tasks')
  const [role, setRole] = useState('')
  const [groups, setGroups] = useState([])
  const [courseData, setCourseData] = useState('')
  const [tasks, setTasks] = useState('')

  useEffect(() => {
    const fetchCourseInfo = async () => {
      const data = await getCourseInfo(course)

      if (data.data.length === 0) {
        navigate('/courses')
      }
      setCourseData(data?.data || [])
      setGroups(data?.groups || [])
      setRole(data?.role || '')
    }

    const fetchTasks = async () => {
      const data = await getTasks(course)
      setTasks(data)
    }
    fetchCourseInfo()
    fetchTasks()
  }, [course, statusMessage, navigate])

  const handleDeleteGroupFromCourse = async (groupId) => {
    const response = await deleteGroupFromCourse(groupId, course)
    setStatusMessage(response?.message || 'Error occurred')
  }

  const handleDeleteCourse = async () => {
    const response = await deleteCourse(course)
    if (response.message) {
      navigate('/courses')
    }
  }

  return (
    <NavigationContainer page={'courses'} role={role}>
      <MainHeader>Інформація про курс</MainHeader>

      <div className="bg-white  shadow-xl shadow-slate-100 rounded-lg w-4/5 lg:w-2/3">
        {courseData.length > 0 && <CourseHeader courseData={courseData[0]} />}
      </div>

      <div className="w-4/5 lg:w-2/3 flex flex-col lg:flex-row mt-8">
        <SideNavigation setMode={setMode} mode={mode} role={role} />

        <div className="w-full mt-6 lg:mt-0 lg:w-3/4">
          {mode === 'tasks' && <TasksSection tasks={tasks} course={course} role={role} groups={groups} />}
          {mode === 'submited' && <SubmitedTasks course={course} role={role} />}
          {mode === 'groups' && (
            <GroupSection
              groups={groups}
              course={course}
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
              handleDeleteGroupFromCourse={handleDeleteGroupFromCourse}
              role={role}
            />
          )}
          {mode === 'settings' && <SettingsSection handleDeleteCourse={handleDeleteCourse} />}
        </div>
      </div>
    </NavigationContainer>
  )
}

export default CourseInfo
