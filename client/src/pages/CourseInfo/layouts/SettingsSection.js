import React from 'react'

const SettingsSection = (props) => {
  return (
    <>
      <div
        className="border-red-100 border-dashed border-2 p-5 text-center text-red-500 cursor-pointer
      hover:text-red-500 hover:border-red-300 "
        onClick={() => props.handleDeleteCourse()}>
        Видалити курс
      </div>
    </>
  )
}

export default SettingsSection
