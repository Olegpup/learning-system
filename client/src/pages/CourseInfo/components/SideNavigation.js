import React from 'react'

const NavButton = ({ name, onClick, active }) => (
  <div
    className={`px-2 py-1 
      transition-all duration-200 ease-in-out
      hover:bg-gray-50 hover:text-gray-700 
      cursor-pointer ${active ? 'bg-gray-100 text-gray-700' : ''}`}
    onClick={onClick}>
    {name}
  </div>
)

const SideNavigation = ({ mode, setMode, role }) => {
  return (
    <div className="w-full lg:w-1/4 lg:pr-6">
      <div className="bg-white p-4 border rounded-md flex flex-col gap-2">
        <div className="text-sm text-gray-500 mb-2">Навігація</div>
        <NavButton name="Завдання" active={mode === 'tasks'} onClick={() => setMode('tasks')} />
        <NavButton name="Групи" active={mode === 'groups'} onClick={() => setMode('groups')} />
        {role === 'teacher' && (
          <NavButton name="Налаштування" active={mode === 'settings'} onClick={() => setMode('settings')} />
        )}
        {role === 'teacher' && (
          <NavButton name="Перевірка завдань" active={mode === 'submited'} onClick={() => setMode('submited')} />
        )}
      </div>
    </div>
  )
}

export default SideNavigation
