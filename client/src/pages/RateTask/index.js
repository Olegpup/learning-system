import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSubmitedTask, rateSubmitedTask } from '../../api/tasks'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import MainHeader from '../../components/ui/Headers/MainHeader'
import { Link } from 'react-router-dom'
import { TaskIcon } from '../../assets/icons/task'
import { FileIcon } from '../../assets/icons/file'
import ContainerDefault from '../../components/ui/Containers/ContainerDefault'
import SubHeader from '../../components/ui/Headers/SubHeader'
import SubmitButton from '../../components/ui/Buttons/SubmitButton'
import LabelInput from '../../components/Forms/LabelInput'

export default function RateTask() {
  const { courseId, taskId } = useParams()
  const [task, setTask] = useState(null)
  const [role, setRole] = useState('')
  const [grade, setGrade] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTask() {
      const response = await getSubmitedTask(courseId, taskId)
      setTask(response.tasks[0])
      setRole(response.role)
    }

    fetchTask()
  }, [courseId, taskId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await rateSubmitedTask(courseId, taskId, task.student_user_id, grade)
    if (response) {
      navigate(0)
    }
  }

  return (
    <NavigationContainer page={'courses'} role={role}>
      <div className="w-4/5 lg:w-2/3">
        <MainHeader>Перевірка виконаного завдання</MainHeader>
        <ContainerDefault>
          {task && (
            <>
              <div className="flex items-center space-x-4 mb-5 border-b pb-2 border-indigo-300">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex justify-center items-center">
                  <TaskIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl text-indigo-700">
                    Учень {task.student_last_name} {task.student_first_name} {task.student_father_name} виконав
                    завдання{task.title}
                  </h1>
                  <p>Тип завдання: {task.task_type}</p>
                </div>
                <div className="text-md">{task.rate === 0 ? 'Не оцінено' : `${task.rate} / 100`}</div>
              </div>
              <Link to={`/courses/${courseId}/task/${task.task_id}`}>
                <div className="bg-indigo-100 rounded-md text-indigo-500 px-4 py-3">
                  <div className="text-lg ">Завдання: {task.task_title}</div>
                  <div>Опис: {task.task_description}</div>
                </div>
              </Link>
              <div className="text-lg my-3 text-gray-500 ">Коментар</div>
              <div className="mb-2">{task.task_comment}</div>
              <div className="text-lg my-3 text-gray-500 ">Надіслані файли</div>
              <div className="flex flex-col gap-2 ">
                {task.files.map((file, index) => (
                  <a href={file.file_url} target="_blank" rel="noreferrer" key={index}>
                    <div
                      className="flex items-center bg-indigo-50 py-3 px-2 rounded-md fill-violet-500 text-violet-500
                        hover:fill-violet-600 hover:text-indigo-800
                        transition-colors ease-in-out duration-300">
                      <FileIcon className=" w-8 h-8 mr-2 " />
                      <h3 className="">{file.caption}</h3>
                    </div>
                  </a>
                ))}
              </div>
              <div></div>
            </>
          )}
        </ContainerDefault>
        {role === 'teacher' && (
          <>
            <SubHeader>Оцінити завдання</SubHeader>
            <ContainerDefault className={'w-full'}>
              {task && !task.is_completed && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <LabelInput label={'Оцінка'} placeholder={'Введіть оцінку '} value={grade} setValue={setGrade} />
                  <SubmitButton value={'Надіслати'} />
                </form>
              )}
            </ContainerDefault>
          </>
        )}
      </div>
    </NavigationContainer>
  )
}
