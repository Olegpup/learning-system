import React, { useEffect, useState, useRef } from 'react'
import { redirect } from 'react-router-dom'
import { getUser, updateUser, changePassword } from '../../api/users'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import MainHeader from '../../components/ui/Headers/MainHeader'
import SubHeader from '../../components/ui/Headers/SubHeader'
import UpdateInput from '../../components/Forms/UpdateInput'
import LabelInput from '../../components/Forms/LabelInput'
import DefaultBadge from '../../components/ui/Badges/DefaultBadge'
import SubmitButton from '../../components/ui/Buttons/SubmitButton'
import ContainerDefault from '../../components/ui/Containers/ContainerDefault'

function Profile() {
  const [userFirstName, setUserFirstName] = useState('')
  const [userLastName, setUserLastName] = useState('')
  const [userFatherName, setUserFatherName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('')

  const prevFirstNameRef = useRef('')
  const prevLastNameRef = useRef('')
  const prevFatherNameRef = useRef('')
  const prevEmailRef = useRef('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    async function fetchData() {
      const data = await getUser()
      if (data) {
        setUserFirstName(data.firstName)
        setUserLastName(data.lastName)
        setUserFatherName(data.fatherName)
        setUserEmail(data.email)
        setRole(data.role)
        setUserId(data.userId)

        prevFirstNameRef.current = data.firstName
        prevLastNameRef.current = data.lastName
        prevFatherNameRef.current = data.fatherName
        prevEmailRef.current = data.email
      } else {
        redirect('/')
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function updateUserData() {
      if (
        userFirstName !== prevFirstNameRef.current ||
        userLastName !== prevLastNameRef.current ||
        userFatherName !== prevFatherNameRef.current ||
        userEmail !== prevEmailRef.current
      ) {
        const response = await updateUser(userId, userFirstName, userLastName, userFatherName, userEmail)

        if (response) {
          prevFirstNameRef.current = userFirstName
          prevLastNameRef.current = userLastName
          prevFatherNameRef.current = userFatherName
          prevEmailRef.current = userEmail
        }
      }
    }

    if (userFirstName && userLastName && userFatherName && userEmail) {
      updateUserData()
    }
  }, [userFirstName, userLastName, userFatherName, userEmail, userId])

  const updatePasswordHandler = async (e) => {
    e.preventDefault()
    await changePassword(oldPassword, newPassword)
  }

  return (
    <NavigationContainer page={'profile'} role={role}>
      {userFirstName && (
        <MainHeader>
          👋 Привіт, {userLastName} {userFirstName}!
        </MainHeader>
      )}

      <ContainerDefault className={'w-4/5 lg:w-2/3'}>
        {userFirstName && (
          <div className="my-3 flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              {role === 'student' ? (
                <DefaultBadge>Учень</DefaultBadge>
              ) : (
                <DefaultBadge>
                  Вчитель
                </DefaultBadge>
              )}
            </div>
            <UpdateInput label={"Ваше ім'я"} value={userFirstName} setValue={setUserFirstName} />
            <UpdateInput label={'Ваше прізвище'} value={userLastName} setValue={setUserLastName} />
            <UpdateInput label={'По батькові'} value={userFatherName} setValue={setUserFatherName} />
            <UpdateInput label={'Ваш email'} value={userEmail} setValue={setUserEmail} />
          </div>
        )}
      </ContainerDefault>

      <SubHeader>Налаштування</SubHeader>
      <ContainerDefault className={'w-4/5 lg:w-2/3'}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg">Оновлення паролю</h3>
        </div>
        <form className="flex flex-col gap-3 my-3" onSubmit={(e) => updatePasswordHandler(e)}>
          <LabelInput
            label={'Пароль'}
            placeholder={'Введіть ваш пароль'}
            value={oldPassword}
            setValue={setOldPassword}
            required={true}
            type={'password'}
          />
          <LabelInput
            label={'Новий пароль'}
            placeholder={'Введіть новий пароль'}
            value={newPassword}
            setValue={setNewPassword}
            required={true}
            type={'password'}
          />
          <SubmitButton value={'Підтвердити'} />
        </form>
      </ContainerDefault>
    </NavigationContainer>
  )
}

export default Profile
