import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGroupInfo, deleteGroup, updateGroup } from '../../api/groups'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import CourseCard from '../../components/ui/Cards/CourseCard'
import MainHeader from '../../components/ui/Headers/MainHeader'
import SubHeader from '../../components/ui/Headers/SubHeader'
import UpdateInput from '../../components/Forms/UpdateInput'
import DefaultBadge from '../../components/ui/Badges/DefaultBadge'
import { GroupsIcon } from '../../assets/icons/groups'
import UserForm from './components/UserForm'
import StudentCard from './components/StudentCard'
import ContainerDefault from '../../components/ui/Containers/ContainerDefault'

function GroupInfo() {
  const { group } = useParams()
  const navigate = useNavigate()

  const [role, setRole] = useState('')
  const [students, setStudents] = useState('')
  const [courses, setCourses] = useState('')
  const [groupData, setGroupData] = useState('')
  const [needUpdate, setNeedUpdate] = useState(false)

  const [groupName, setGroupName] = useState('')

  const prevGroupName = useRef('')

  useEffect(() => {
    async function fetchData() {
      const data = await getGroupInfo(group)
      if (!data?.data) {
        return navigate('/groups')
      }
      setGroupData(data.data[0])
      setGroupName(data.data[0].title)
      setCourses(data.courses)
      setStudents(data.users)
      setRole(data.role)

      prevGroupName.current = data.data[0].title
    }

    fetchData()
    setNeedUpdate(false)
  }, [group, needUpdate, navigate])

  useEffect(() => {
    async function updateGroupName() {
      if (groupName !== prevGroupName.current) {
        const response = await updateGroup(group, groupName)

        if (response) {
          prevGroupName.current = groupName
        }
      }
    }

    if (groupName) {
      updateGroupName()
    }
  }, [groupName, group])

  const handleDeleteGroup = async () => {
    const response = await deleteGroup(group)
    if (response.message) {
      return navigate('/groups')
    }
  }

  const update = () => {
    setNeedUpdate(true)
  }

  return (
    <NavigationContainer page={'groups'} role={role}>
      <MainHeader>Інформація про группу</MainHeader>

      <ContainerDefault className={'w-4/5 lg:w-2/3'}>
        {groupData && (
          <div>
            <div className="my-3 flex flex-col gap-3">
              <UpdateInput
                label={'Назва групи'}
                value={groupName}
                setValue={setGroupName}
                disabled={role === 'student' ? true : false}
              />
              <UpdateInput
                label={'Вчитель'}
                value={`${groupData.teacher_last_name} ${groupData.teacher_first_name} ${groupData.teacher_father_name}`}
                disabled
              />
            </div>
          </div>
        )}
      </ContainerDefault>

      <SubHeader>Учні</SubHeader>
      <ContainerDefault className={'w-4/5 lg:w-2/3'}>
        {students.length > 0 ? (
          students.map((student, index) => (
            <StudentCard student={student} key={index} update={update} editable={role === 'student' ? false : true} />
          ))
        ) : (
          <p className="text-gray-500">Учнів ще не додано до групи</p>
        )}
      </ContainerDefault>

      {role === 'teacher' && (
        <>
          <SubHeader>Додати учня</SubHeader>
          <ContainerDefault className={'w-4/5 lg:w-2/3'}>
            <UserForm update={update} />
          </ContainerDefault>
        </>
      )}

      <SubHeader>Курси, на яких навчається группа</SubHeader>
      <div className="flex flex-wrap gap-2 w-2/3">
        {courses.length > 0 ? (
          courses.map((course, index) => <CourseCard course={course} key={index} />)
        ) : (
          <p>Курси не знайдено</p>
        )}
      </div>

      {role === 'teacher' && (
        <>
          <SubHeader>Видалити групу</SubHeader>
          <ContainerDefault className={'w-4/5 lg:w-2/3'}>
            <button className="text-red-500" onClick={() => handleDeleteGroup()}>
              Видалити
            </button>
          </ContainerDefault>
        </>
      )}
    </NavigationContainer>
  )
}

export default GroupInfo
