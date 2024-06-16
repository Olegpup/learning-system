import React from 'react'

const MainHeader = ({ children }) => (
  <div className="w-4/5 lg:w-2/3 my-4">
    <h2 className="text-xl text-gray-500">{children}</h2>
  </div>
)

export default MainHeader
