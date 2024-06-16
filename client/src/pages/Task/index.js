import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTask, submitTask, deleteTask } from '../../api/tasks'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import MainHeader from '../../components/ui/Headers/MainHeader'
import SubHeader from '../../components/ui/Headers/SubHeader'
import { TaskIcon } from '../../assets/icons/task'
import { FileIcon } from '../../assets/icons/file'
import ContainerDefault from '../../components/ui/Containers/ContainerDefault'
import FileUpload from '../../components/Forms/FileUpload'
import LabelTextarea from '../../components/Forms/LabelTextarea'
import SubmitButton from '../../components/ui/Buttons/SubmitButton'
import SubgroupCard from '../../components/ui/Cards/SubgroupCard'
import DeleteButton from '../../components/ui/Buttons/DeleteButton'
import { GroupsIcon } from '../../assets/icons/groups'

export default function TaskPage() {
  const { courseId, taskId } = useParams()
  const [task, setTask] = useState(null)
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState(null)
  const [files, setFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])
  const [description, setDescription] = useState('')
  const [userSubgroup, setUserSubgroup] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTask() {
      const response = await getTask(courseId, taskId)
      setTask(response.tasks[0])
      setRole(response.role)
      setUserId(response.userId)
    }

    fetchTask()
  }, [courseId, taskId])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('description', description)

    files.forEach(({ file }) => {
      formData.append('files', file)
    })

    const result = await submitTask(courseId, taskId, formData)
    if (result) {
      navigate(0)
    } else {
      console.error('Failed to add task')
    }
  }

  const handleDeleteTask = async () => {
    const response = await deleteTask(courseId, taskId)
    if (response) {
      navigate(`/courses/${courseId}/`)
    }
  }

  function findUserSubgroup(userId, subgroups) {
    for (const subgroup of subgroups) {
      for (const member of subgroup.members_details) {
        if (member.id === userId) {
          return subgroup
        }
      }
    }
    return null
  }

  useEffect(() => {
    if (userId && task && task.subgroups) {
      const subgroup = findUserSubgroup(userId, task.subgroups)
      setUserSubgroup(subgroup)
    }
  }, [task])

  return (
    <NavigationContainer page={'courses'} role={role}>
      <div className="w-4/5 lg:w-2/3">
        <MainHeader>Інформація про завдання</MainHeader>
        <div className="flex">
          <div className="w-full">
            <div className="flex flex-col md:flex-row">
              <div className="w-full p-5 bg-white shadow-lg shadow-slate-200 border rounded-lg">
                {task && (
                  <>
                    <div className="flex items-center space-x-4 mb-5 border-b pb-2 border-indigo-300">
                      <div className="w-12 h-12 rounded-full bg-indigo-500 flex justify-center items-center">
                      {task.task_type === 'group' ? <GroupsIcon className="w-6 h-6 text-white" /> : <TaskIcon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h1 className="text-xl text-indigo-700">Виконайте завдання: "{task.title}"</h1>
                        {/* <p>Тип завдання: {task.task_type}</p> */}
                        <p className="text-indigo-900">
                          {formatDate(task.publish_date)} - {formatDate(task.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h2 className="text-lg text-gray-500 ">Опис завдання:</h2>
                      <p className="text-md">{task.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {task.files.map((file, index) => (
                        <a href={file.file_url} target="_blank" rel="noreferrer" key={index}>
                          <div
                            key={file.file_id}
                            className="flex items-center bg-indigo-50 py-3 px-2 rounded-md fill-violet-500 text-violet-500
                        hover:fill-violet-600 hover:text-indigo-800
                        transition-colors ease-in-out duration-300">
                            <FileIcon className=" w-8 h-8 mr-2 " />
                            <h3 className="">{file.caption}</h3>
                          </div>
                        </a>
                      ))}
                    </div>
                    {role === 'student' && (
                      <div>
                        <div className="text-lg my-3 text-gray-500 ">Оцінка </div>
                        <span>{task.completed_rate ? `${task.completed_rate}/100` : `Не оцінено`}</span>
                      </div>
                    )}
                    {role === 'teacher' && (
                      <div>
                        <div className="text-lg my-3 text-gray-500">Керування завданням</div>
                        <DeleteButton title={'Видалити'} onCLick={handleDeleteTask} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {task && task.task_type == 'group' && (
          <>
            <SubHeader>Інформація про підгрупи</SubHeader>
            {role === 'student' && (
              <ContainerDefault className={'w-full'}>
                <SubgroupCard subgroup={findUserSubgroup(userId, task.subgroups)} index={1}/>
              </ContainerDefault>
            )}
            {role === 'teacher' && (
              <ContainerDefault className={'w-full'}>
                {task.subgroups.map((subgroup, index) => (
                  <SubgroupCard subgroup={subgroup} index={index} key={index} />
                ))}
              </ContainerDefault>
            )}
          </>
        )}
        {role === 'student' && (task.task_type === 'group' ? userSubgroup?.leader_id === userId : true) && task.is_completed !== 1 && (
          <>
            <SubHeader>Здати виконане завдання</SubHeader>
            <ContainerDefault className={'w-full'}>
              {task && !task.is_completed && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <LabelTextarea
                    label={'Коментар'}
                    placeholder={'Введіть коментар'}
                    value={description}
                    setValue={setDescription}
                  />
                  <FileUpload
                    files={files}
                    setFiles={setFiles}
                    filePreviews={filePreviews}
                    setFilePreviews={setFilePreviews}
                  />
                  <SubmitButton value={'Надіслати'} />
                </form>
              )}
            </ContainerDefault>
          </>
        )}
        {task && task.is_completed === 1 && (
          <>
            <SubHeader>Надіслане завдання</SubHeader>
            <ContainerDefault className={'w-full'}>
              <div className='flex flex-col gap-2'>
                <p><span className='text-gray-500 text-lg'>Текст надісланого завдання:</span> {task.completed_description}</p>
                <div><span className='text-gray-500 text-lg'>Дата виконання:</span> {formatDate(task.completed_date)}</div>
              </div>
            </ContainerDefault>
          </>
        )}
      </div>
    </NavigationContainer>
  )
}
