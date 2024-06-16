import React, { useState } from 'react'
import { createCourse } from '../../../api/courses'
import LabelInput from '../../../components/Forms/LabelInput'
import EasyOpen from '../../../components/Animations/EasyOpen'
import CloseButton from '../../../components/ui/Buttons/CloseButton'

export default function CourseForm({ update, close }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleFormSubmit = async (e) => {
    console.log(title, description)
    e.preventDefault()
    const data = await createCourse(title, description)
    update(data.data)
    setTitle('')
    setDescription('')
  }

  return (
    <EasyOpen duration={500} onClose={close} transitionStyles="transition-all ease-in-out">
      {(closeForm) => (
        <>
          <div className="bg-white p-6 shadow-xl shadow-slate-100 w-96 ">
            <div className="w-full my-4 flex justify-between">
              <h1>Створити курс</h1>
              <CloseButton title={'Закрити'} onClick={closeForm} />
            </div>
            
            <form className="flex flex-col gap-2" onSubmit={(e) => handleFormSubmit(e)}>
              <LabelInput
                label="Назва курсу"
                name="title"
                value={title}
                id="title"
                placeholder="Введіть назву"
                type="text"
                required={true}
                setValue={setTitle}
              />
              <LabelInput
                label="Опис курсу"
                name="description"
                value={description}
                id="description"
                placeholder="Введіть короткий опис курсу"
                type="text"
                required={true}
                setValue={setDescription}
              />

              <input
                type="submit"
                id="login-button"
                value="Створити"
                className="transition-colors duration-300 ease-in-out cursor-pointer bg-black border border-black text-white rounded-full py-3 mt-8 hover:bg-transparent hover:text-black"
              />
            </form>
          </div>
        </>
      )}
    </EasyOpen>
  )
}
