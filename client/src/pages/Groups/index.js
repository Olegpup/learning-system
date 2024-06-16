import React, { useEffect, useState } from 'react'
import { getGroups, createGroup } from '../../api/groups'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import MainHeader from '../../components/ui/Headers/MainHeader'
import SubHeader from '../../components/ui/Headers/SubHeader'

import ContainerDefault from '../../components/ui/Containers/ContainerDefault'
import SubmitButton from '../../components/ui/Buttons/SubmitButton'
import LabelInput from '../../components/Forms/LabelInput'

import { Link } from 'react-router-dom'
import { GroupsIcon } from '../../assets/icons/groups'
import { ViewIcon } from '../../assets/icons/view'

const GroupCard = ({ group }) => (
  <Link to={`/groups/${group.group_id}`}>
    <div
      className="flex items-center justify-between text-gray-500 fill-gray-500 py-3 px-4 rounded-md
    transition-colors ease-in-out hover:animate-pulse
    hover:bg-gray-50 hover:text-black">
      <div className="flex gap-2 ">
        <GroupsIcon className={'w-7 h-7'} />
        <p>{group.title}</p>
      </div>
      <button className="underline underline-offset-4">
        <ViewIcon className={'w-7 h-7 '} />
      </button>
    </div>
  </Link>
)

function Groups() {
  const [role, setRole] = useState('')
  const [groupsData, setGroupsData] = useState('')

  const [title, setTitle] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const data = await createGroup(title)
    setGroupsData(data.data)
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getGroups()
      setGroupsData(data?.data)
      setRole(data?.role)
    }

    fetchData()
  }, [])

  return (
    <NavigationContainer page={'groups'} role={role}>
      <div className='w-4/5 lg:w-1/3'>
      <MainHeader>Групи</MainHeader>
      </div>
      {groupsData && groupsData.length > 0 && (
        <ContainerDefault className={'w-4/5 lg:w-1/3 gap-3'}>
          {groupsData.map((group, index) => (
            <GroupCard group={group} key={index} />
          ))}
        </ContainerDefault>
      )}
      {!groupsData && <p className="text-lg text-gray-500">Ви ще не створили не однієї групи</p>}

      <div className='w-4/5 lg:w-1/3'>
      <SubHeader>Створити групу</SubHeader>
      </div>

      <ContainerDefault className={'gap-3 w-4/5 lg:w-1/3'}>
        {role === 'teacher' && (
          <form className="flex flex-col gap-2" onSubmit={(e) => handleFormSubmit(e)}>
            <LabelInput
              label="Назва групи"
              name="title"
              value={title}
              id="title"
              placeholder="Введіть назву групи"
              type="text"
              required={true}
              setValue={setTitle}
            />
            <SubmitButton value={'Створити'} />
          </form>
        )}
      </ContainerDefault>
    </NavigationContainer>
  )
}

export default Groups
