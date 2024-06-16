import React, { useState } from 'react'
import { userLogin } from '../../../api/users'
import LabelInput from '../../../components/Forms/LabelInput'

export default function LoginForm({ changeMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const response = await userLogin(email, password)

    if (!response) {
      setErrorMessage('Помилка авторизації. Перевірте введені дані.')
    }
  }

  return (
    <>
      <h3 className="text-xl mb-4">Вхід до особистого кабінету</h3>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => handleFormSubmit(e)}>
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
          id="login-button"
          value="Авторизуватись"
          className="transition-colors duration-300 ease-in-out cursor-pointer bg-black border border-black text-white rounded-full py-3 mt-8 hover:bg-transparent hover:text-black"
        />
        {errorMessage && <div className="text-red-500 bg-red-100 px-4 py-2 rounded">{errorMessage}</div>}

        <div className="flex items-center w-full py-2 my-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-600">
            Реєстрація вчитееля
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <div className="flex justify-center">
          <button
            className="transition-colors ease-out duration-300 hover:text-indigo-500 underline text-xl"
            onClick={() => changeMode()}>
            Зареєструватись як вчитель
          </button>
        </div>
      </form>
    </>
  )
}
