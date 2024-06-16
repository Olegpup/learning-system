import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGroupsAviableForAdding, addGroupToCourse } from '../../../api/courses'
import EasyOpen from '../../../components/Animations/EasyOpen'
import CloseButton from '../../../components/ui/Buttons/CloseButton'

function AddGroupForm({ courseId, statusMessage, setStatusMessage, close }) {
  const [groupsData, setGroupsData] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchGroupsAvailableForAdding = async () => {
      const data = await getGroupsAviableForAdding(courseId)
      const groups = data?.data || []
      setGroupsData(groups)
      setFilteredGroups(groups.slice(0, 5))
    }

    fetchGroupsAvailableForAdding()
  }, [courseId, statusMessage])

  useEffect(() => {
    const results = groupsData.filter(
      (group) =>
        group.group_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${group.teacher_last_name} ${group.teacher_first_name} ${group.teacher_father_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    setFilteredGroups(results.slice(0, 5))
  }, [searchTerm, groupsData])

  const handleAddGroupToCourse = async (groupId) => {
    const response = await addGroupToCourse(groupId, courseId)
    setStatusMessage(response?.message)
  }

  return (
    <EasyOpen duration={700} onClose={close} transitionStyles="transition-all ease-in-out">
      {(closeForm) => (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg">Додати групу до курсу</h3>
              <p className="text-sm text-gray-500">
                Оберіть групу зі списку, або почніть вводити текст для пошуку конкретної групи
              </p>
            </div>
            <CloseButton title="Закрити" onClick={closeForm} />
          </div>
          <input
            type="text"
            placeholder="Поиск групп"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <table className="table-auto w-full text-left  rounded-lg">
            <thead className="bg-indigo-100 text-indigo-700 ">
              <tr>
                <th className="py-2 px-4 font-normal">#</th>
                <th className="py-2 px-4 font-normal">Назва групи</th>
                <th className="py-2 px-4 font-normal">Вчитель</th>
                <th className="py-2 px-4 font-normal"></th>
                <th className="py-2 px-4 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <tr key={group.group_id} className="hover:bg-gray-50">
                    <td className="py-2 px-4">{group.group_id}</td>
                    <td className="py-2 px-4">{group.group_title}</td>
                    <td className="py-2 px-4">
                      {group.teacher_last_name} {group.teacher_first_name} {group.teacher_father_name}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => handleAddGroupToCourse(group.group_id)}>
                        Додати
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/groups/${group.group_id}`}>
                        <button className="text-indigo-600 hover:underline">Переглянути</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Доступні групи не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </EasyOpen>
  )
}

export default AddGroupForm
