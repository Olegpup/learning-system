import React, { useEffect, useState } from 'react'
import { getCourses } from '../../api/courses'

import CourseForm from './components/CourseForm'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import MainHeader from '../../components/ui/Headers/MainHeader'
import CourseCard from '../../components/ui/Cards/CourseCard'

function Courses() {
  const [role, setRole] = useState('')
  const [coursesData, setCoursesData] = useState('')
  const [openedModal, setOpenedModal] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getCourses()
      setCoursesData(data.data)
      setRole(data.role)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleOpen = () => {
    setOpenedModal(!openedModal)
  }

  return (
    <NavigationContainer page={'courses'} role={role}>
      <MainHeader>Мої курси</MainHeader>

      <div className="w-4/5 lg:w-2/3 flex flex-wrap gap-3  ">
        {coursesData.length > 0 && coursesData.map((course, index) => <CourseCard course={course} key={index} index={index} />)}

        {!openedModal && !isLoading && role === 'teacher' && (
          <div
            className="w-72 h-64 border-4 border-dashed rounded-md flex items-center justify-center cursor-pointer
            text-gray-300
            transition-colors 
            hover:animate-pulse
            hover:border-indigo-300 hover:text-indigo-300 "
            onClick={handleOpen}>
            <span className="text-lg  font-medium flex flex-col items-center">
              <span className="text-8xl ">+</span>
            </span>
          </div>
        )}

        {openedModal && role === 'teacher' && <CourseForm update={setCoursesData} close={handleOpen} />}
      </div>
    </NavigationContainer>
  )
}

export default Courses
