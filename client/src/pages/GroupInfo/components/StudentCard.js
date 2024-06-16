import React from 'react'
import DefaultBadge from '../../../components/ui/Badges/DefaultBadge'
import { ClipboardIcon } from '../../../assets/icons/clipboard'
import { deleteStudent } from '../../../api/groups'
import { useParams } from 'react-router-dom'
import { TrashIcon } from '../../../assets/icons/trash'

const StudentCard = ({ student, update, editable = true }) => {
  const { group } = useParams()
  const copyToClipboard = () => {
    const clipboardText = `${student.email}:temporary_pwd_${student.user_id}`;
    navigator.clipboard.writeText(clipboardText)
      .then(() => {
        alert(`Інформація скопійована: ${clipboardText}`);
      })
      .catch((err) => {
        alert('Помилка при копіюванні: ' + err.message);
      });
  }

  const handleDeleteStudent = async () => {
    await deleteStudent(group, student.user_id)
    update()
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between p-2 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
        <div>
          <DefaultBadge>
            <span className="text-xs">#{student.user_id}</span>
          </DefaultBadge>
        </div>
        <div>
          {student.last_name} {student.first_name} {student.father_name}
        </div>
        <div className="text-gray-400">{student.email}</div>
      </div>
      {editable && (<div className={'mt-3 lg:mt-0 flex gap-2'}>
        <button
          onClick={handleDeleteStudent}
          className="flex items-center text-s bg-rose-100 rounded-md justify-center w-10 h-10 text-rose-500
          hover:bg-rose-200 hover:text-rose-600">
          <TrashIcon className="w-6 h-6 " />
        </button>
        <button onClick={copyToClipboard} className="flex items-center gap-1 text-indigo-500 bg-indigo-100 rounded-md justify-center w-10 h-10
        hover:bg-indigo-200 hover:text-indigo-600">
          <ClipboardIcon className="w-6 h-6" />
        </button>
      </div>)}
    </div>
  )
}

export default StudentCard
