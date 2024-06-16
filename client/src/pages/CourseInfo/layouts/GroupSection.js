import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ContainerDefault from '../../../components/ui/Containers/ContainerDefault'
import AddGroupForm from '../components/AddGroupForm'
import GroupDetails from '../../../components/ui/Cards/GroupDetails'

const GroupSection = ({ groups, handleDeleteGroupFromCourse, role, course, statusMessage, setStatusMessage }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleOpen = () => {
    setOpenModal(!openModal)
  }

  return (
    <div className="flex flex-col gap-4">
      <ContainerDefault>
        <div className="w-2/3 my-4">
          <h3 className="text-lg">Групи які навчаються на курсі</h3>
        </div>
        {groups &&
          groups.map((group) => (
            <GroupDetails key={group.group_id} group={group} handleDelete={handleDeleteGroupFromCourse} role={role} />
          ))}
        {!groups && <p>Групп не знайдено</p>}
      </ContainerDefault>

      {!openModal && role === 'teacher' && (
        <div
          className="border-dashed border-2 p-5 text-center text-gray-500 hover:text-indigo-500 hover:border-indigo-300 cursor-pointer"
          onClick={handleOpen}>
          + Додати групи
        </div>
      )}

      {role === 'teacher' && openModal && (
        <AddGroupForm
          courseId={course}
          statusMessage={statusMessage}
          setStatusMessage={setStatusMessage}
          close={handleOpen}
        />
      )}
    </div>
  )
}

export default GroupSection
