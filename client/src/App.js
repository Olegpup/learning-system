import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Authorization from './pages/Authorization'
import Profile from './pages/Profile'
import Courses from './pages/Courses'
import Groups from './pages/Groups'
import GroupInfo from './pages/GroupInfo'
import MyGroup from './pages/MyGroup/MyGroup'
import CourseInfo from './pages/CourseInfo'
import Task from './pages/Task'
import RateTask from './pages/RateTask'

import './App.css'
import handleLogout from './navigation/middlewares/handleLogout'
import requireAuth from './navigation/middlewares/requireAuth'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Profile />,
      loader: requireAuth(),
    },
    {
      path: '/authorization',
      element: <Authorization />,
    },
    {
      path: '/logout',
      loader: handleLogout(),
    },

    {
      path: '/courses',
      element: <Courses />,
      loader: requireAuth(),
    },
    {
      path: '/courses/:course',
      element: <CourseInfo />,
      loader: requireAuth(),
    },

    {
      path: '/groups',
      element: <Groups />,
      loader: requireAuth(),
    },
    {
      path: '/groups/:group',
      element: <GroupInfo />,
      loader: requireAuth(),
    },
    {
      path: '/mygroup',
      element: <MyGroup />,
      loader: requireAuth(),
    },
    {
      path: '/courses/:courseId/task/:taskId/',
      element: <Task />,
      loader: requireAuth(),
    },
    {
      path: '/courses/:courseId/submited-task/:taskId/',
      element: <RateTask/>,
      loader: requireAuth(),
    },
  ])

  return <RouterProvider router={router} />
}

export default App
