import React from 'react'

const DeleteButton = ({ title, onCLick }) => (
  <button
    onClick={onCLick}
    className="w-full py-2 px-1 cursor-pointer
                  transition-colors ease-in-out duration-300
                border-2 border-red-300 border-dashed
                text-red-300
                hover:text-red-500 hover:border-red-600 hover:bg-red-100
                flex items-center justify-center">
    {title}
  </button>
)

export default DeleteButton
