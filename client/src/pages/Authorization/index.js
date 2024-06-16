import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

import TypingText from '../../components/Animations/TypingText'

function Authorization() {
  const [register, setRegister] = useState(false)

  const handleChangeMode = () => {
    setRegister(!register)
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col lg:justify-center  lg:items-center">
      <div
        className="h-min-screen lg:h-fit  w-full lg:w-2/3 
      bg-black lg:rounded-3xl transition-all ease-in-out duration-300  flex flex-col lg:flex-row shadow-lg lg:my-10 justify-end">
        <div className="w-full lg:w-1/2 pt-20 px-12 pb-6 text-wrap lg:pb-0 ">
          <h1 className="text-white uppercase text-3xl font-bold mb-6">
            System<span className="text-indigo-500">Learning</span>
          </h1>
          <div className="min-h-32">
            <TypingText>
              Увійдіть в систему як Учень, щоб отримати доступ до виконання або перегляду вашого домашнього завдання.
              Якщо ви вчитель, авторизуйтесь, щоб мати можливість додавати групи, курси та завдання, а також оцінювати
              роботи учнів.
            </TypingText>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white p-20 rounded-t-3xl lg:rounded-3xl transition-all ease-in-out duration-300 ">
          {!register && <LoginForm changeMode={handleChangeMode} />}
          {register && <RegisterForm changeMode={handleChangeMode} />}
        </div>
      </div>
    </div>
  )
}

export default Authorization
