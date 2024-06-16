import React, { useEffect, useState } from 'react'
import { getUserGroup } from '../../api/groups'
import NavigationContainer from '../../components/ui/Navigation/NavigationContainer'
import MainHeader from '../../components/ui/Headers/MainHeader'
import ContainerDefault from '../../components/ui/Containers/ContainerDefault'
import GroupDetails from '../../components/ui/Cards/GroupDetails'

const MyGroup = () => {
  const [role, setRole] = useState('')
  const [groupData, setGroupData] = useState(null)

  useEffect(() => {
    const fetchGroup = async () => {
      const response = await getUserGroup()
      setGroupData(response[0])
      setRole(response[0].role)
    }
    fetchGroup()
  }, [])

  return (
    <NavigationContainer page="groups" role={role}>
      <div className="lg:w-1/3">
        <MainHeader>Моя група</MainHeader>
        {groupData && (
          <ContainerDefault>
            <GroupDetails group={groupData} role={role}/>
          </ContainerDefault>
        )}
      </div>
    </NavigationContainer>
  )
}

export default MyGroup
