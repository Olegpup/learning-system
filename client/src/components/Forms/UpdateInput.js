import React, { useState } from 'react'
import { EditIcon } from '../../assets/icons/edit'

const EditButton = ({ onClick, className, children }) => {
  let colors = className
  if (!colors) {
    colors = `bg-indigo-200 text-indigo-500 
    hover:bg-indigo-300 hover:text-indigo-600`
  }
  const styles = `text-sm w-9 h-9 rounded flex justify-center items-center ${colors}`
  return (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  )
}

const UpdateInput = ({ label, value, setValue, disabled = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleEditClick = () => {
    setTempValue(value)
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    setValue(tempValue)
    setIsEditing(false)
  }

  const handleInputChange = (e) => {
    setTempValue(e.target.value)
  }

  return (
    <div className="relative flex items-center gap-3">
      <div className="text-nowrap w-1/4">{label}:</div>
      {isEditing ? (
        <input
          type="text"
          className="bg-gray-50 px-2 py-3 w-full rounded-md "
          value={tempValue}
          onChange={handleInputChange}
        />
      ) : (
        <div className="bg-gray-50 px-2 py-3 w-full rounded-md text-gray-500">{value}</div>
      )}
      {!disabled && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isEditing ? (
            <div className="flex gap-2">
              <EditButton onClick={handleSaveClick}>✓</EditButton>
              <EditButton
                className={`bg-rose-200 text-rose-500 
    hover:bg-rose-300 hover:text-rose-600`}
                onClick={() => setIsEditing(false)}>
                &times;
              </EditButton>
            </div>
          ) : (
            <EditButton onClick={handleEditClick}>
              <EditIcon className={'w-5 h-5'} />
            </EditButton>
          )}
        </div>
      )}
    </div>
  )
}

export default UpdateInput
