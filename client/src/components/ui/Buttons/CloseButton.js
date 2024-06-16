import React from 'react'

const CloseButton = ({title, onClick}) => (
  <div className="cursor-pointer text-gray-500 border px-2 py-1 rounded text-sm cursor-pointer
  transition-colors ease-in-out duration-200
  hover:border-black hover:text-black" onClick={onClick}>
    {title}
  </div>
)

export default CloseButton
