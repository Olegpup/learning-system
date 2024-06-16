import React, { useState } from 'react'
import { addTask } from '../../../api/tasks'
import LabelInput from '../../../components/Forms/LabelInput'
import DateInput from '../../../components/Forms/DateInput'
import LabelTextarea from '../../../components/Forms/LabelTextarea'
import CloseButton from '../../../components/ui/Buttons/CloseButton'
import EasyOpen from '../../../components/Animations/EasyOpen'
import FileUpload from '../../../components/Forms/FileUpload'
import SelectInput from '../../../components/Forms/SelectInput'
import { useNavigate } from 'react-router-dom'

function TaskForm({ courseId, close, groups }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endDate, setEndDate] = useState('')
  const [files, setFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])
  const [needSubgroups, setNeedSubgroups] = useState(false)
  const [countSubgroups, setCountSubgroups] = useState(2)
  const [group, setGroup] = useState(groups.length > 0 ? groups[0].group_id : null)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const options = [
    { value: false, title: 'Для кожного учня' },
    { value: true, title: 'Підгрупи' },
  ]

  console.log(groups)
  const selectableGroups = Array.isArray(groups) && groups.length > 0
  ? groups.map(item => ({
      value: item.group_id,
      title: item.group_title,
    }))
  : [{ value: null, title: "Груп ще не додано до курсу" }];

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title || !description || !endDate) {
      return setErrorMessage('Помилка! Будь ласка, заповніть всі поля перед продовження.')
    }
    if (!group) {
      return setErrorMessage('Помилка! Оберіть групу, або додайте групу до курсу.')
    }
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('endDate', endDate)

    if (needSubgroups) {
      formData.append('countSubgroups', countSubgroups)
    }

    files.forEach(({ file }) => {
      formData.append('files', file)
    })

    const result = await addTask(courseId, formData, group)
    if (result) {
      navigate(0)
    } else {
      setErrorMessage('Виникла помилка при створенні завдання ')
    }
  
  }

  return (
    <EasyOpen duration={700} onClose={close} transitionStyles="transition-all ease-in-out">
      {(closeForm) => (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 border-gray-100 border-2 rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Створення нового завдання</h3>
            <CloseButton title="Закрити" onClick={closeForm} />
          </div>
          <div className="p-4 flex flex-col gap-4">
            <LabelInput
              label={'Назва завдання'}
              type={'text'}
              value={title}
              setValue={setTitle}
              placeholder={'Назва завдання'}
            />
            <LabelTextarea
              label={'Опис завдання'}
              value={description}
              setValue={setDescription}
              placeholder={'Введіть опис завдання'}
            />
            <SelectInput value={needSubgroups} setValue={setNeedSubgroups} options={options} />
            <SelectInput value={group} setValue={setGroup} options={selectableGroups} />
            {needSubgroups === 'true' && (
              <LabelInput
                type={'number'}
                required={true}
                value={countSubgroups}
                setValue={setCountSubgroups}
                label={'Кількість підгруп'}
                placeholder={'Введіть кількість підгруп'}
              />
            )}

            <FileUpload
              files={files}
              setFiles={setFiles}
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
            />

            {errorMessage && <div className="text-red-500 bg-red-100 px-4 py-2 rounded">{errorMessage}</div>}
            <div className="flex justify-end items-baseline">
              <div className="flex items-center gap-3">
                <DateInput value={endDate} setValue={setEndDate} />
                <button
                  type="submit"
                  className="border border-black p-2 px-4 bg-black text-white rounded-lg
                  hover:text-black hover:bg-transparent
                  transition-colors ease-in duration-200">
                  Створити
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </EasyOpen>
  )
}

export default TaskForm
