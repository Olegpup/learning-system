import React, { useState } from 'react'
import { userRegister } from '../../../api/users'
import LabelInput from '../../../components/Forms/LabelInput'

export default function RegisterForm({ changeMode }) {
  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const response = await userRegister(firstName, secondName, fatherName, email, password)
    if (!response) {
      setErrorMessage('Помилка реєстрації. Можливо користувач з таким email вже існує.')
    }
  }

  return (
    <>
      <h3 className="text-xl mb-4">Реєстрація вчителя</h3>
      <form action="" className="flex flex-col gap-2" onSubmit={(e) => handleFormSubmit(e)}>
        <LabelInput
          label="Ім'я"
          name="first_name"
          value={firstName}
          id="first_name"
          placeholder="Введіть ваше Ім'я"
          type="text"
          required={true}
          setValue={setFirstName}
        />

        <LabelInput
          label="Прізвище"
          name="second_name"
          value={secondName}
          id="second_name"
          placeholder="Введіть ваше Прізвище"
          type="text"
          required={true}
          setValue={setSecondName}
        />

        <LabelInput
          label="По батькові"
          name="father_name"
          value={fatherName}
          id="father_name"
          placeholder="Введіть ваше По батькові"
          type="text"
          required={true}
          setValue={setFatherName}
        />

        <LabelInput
          label="Email"
          name="email"
          value={email}
          id="email"
          placeholder="Введіть ваш email"
          type="email"
          required={true}
          setValue={setEmail}
        />
        <LabelInput
          label="Пароль"
          name="password"
          value={password}
          id="password"
          placeholder="Введіть ваш пароль"
          type="password"
          required={true}
          setValue={setPassword}
        />

        <input
          type="submit"
          id="register-button"
          value="Зареєструватись"
          className="transition-colors duration-300 ease-in-out cursor-pointer bg-black border border-black text-white rounded-full py-3 mt-8 hover:bg-transparent hover:text-black"
        />

        {errorMessage && <div className="text-red-500 bg-red-100 px-4 py-2 rounded">{errorMessage}</div>}
      </form>

      <div className="flex items-center w-full py-2 my-8">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-sm text-gray-600">Повернутись до авторизації</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      <div className="flex justify-center">
        <button
          className="transition-colors ease-out duration-300 hover:text-indigo-500 underline text-xl"
          onClick={() => changeMode()}>
          Авторизація
        </button>
      </div>
    </>
  )
}
