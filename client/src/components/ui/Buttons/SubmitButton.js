import React from 'react'

const SubmitButton = ({ value }) => (
  <input
    type="submit"
    value={value}
    className="transition-colors duration-300 ease-in-out cursor-pointer bg-black border border-black text-white rounded-full py-3 mt-8 hover:bg-transparent hover:text-black"
  />
)

export default SubmitButton
