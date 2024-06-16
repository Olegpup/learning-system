import React from 'react'
import { Link } from 'react-router-dom'
import { textShort } from '../../../utils/textShort'
import { UserIcon } from '../../../assets/icons/user'

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${course.course_id}`}
    className="group flex flex-col gap-1 bg-indigo-300 pt-8 px-6 pb-5 rounded-md w-64 lg:w-72
              hover:bg-indigo-500
              transition-all ease-in-out duration-300">
    <div className="font-semibold pb-5 border-white text-white border-b-2">
      {textShort(course.title, 30)}
      <p className="mb-1 text-gray-50 text-xs flex gap-1 mt-1">
        <UserIcon className={'w-4 h-4'} />
        {course.author_last_name} {course.author_first_name} {course.author_father_name}
      </p>
    </div>

    <p className="pt-4 mb-5 flex-1 text-gray-200">{textShort(course.description, 50)}</p>

    <div
      className="group-hover:bg-indigo-400 
    border-l-2  text-white pl-3  py-2 w-full text-start
    transition-all ease-in-out duration-300">
      Детальніше
    </div>
  </Link>
)

export default CourseCard