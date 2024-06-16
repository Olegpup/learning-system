import React from 'react'

const CourseHeader = ({ courseData }) => (
  <div>
    <div className="bg-indigo-500 rounded-t-lg px-6 pt-24 pb-6">
      <h1 className="text-3xl text-white font-semibold">{courseData.title}</h1>
      <p className="text-white">{courseData.description.length > 50 ? courseData.description.substring(0, 47) + '...' : courseData.description}</p>
    </div>
    <div className="p-6">
      <p className="text-sm">
        <span className="font-semibold">Опис курсу:</span> {courseData.description}
      </p>
      <p className="text-sm">
        <span className="font-semibold">Вчитель:</span> {courseData.author_last_name} {courseData.author_first_name}{' '}
        {courseData.author_father_name}
      </p>
    </div>
  </div>
)

export default CourseHeader
