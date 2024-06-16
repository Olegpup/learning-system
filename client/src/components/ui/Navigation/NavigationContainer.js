import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserIcon } from '../../../assets/icons/user'
import { LogoutIcon } from '../../../assets/icons/logout'
import { CoursesIcon } from '../../../assets/icons/courses'
import { GroupsIcon } from '../../../assets/icons/groups'
import { MenuIcon } from '../../../assets/icons/menu'

const NavLink = ({ link, title, active }) => (
  
  <Link to={link}>
    <div
      className={`text-gray-700 py-1 px-2 w-full 
      transition-colors ease-in-out duration-300
      hover:text-black hover:bg-slate-100 
      ${active && 'border-l bg-gray-100 border-black'}`}>
      {title}
    </div>
  </Link>
)
export default function NavigationContainer({ role, children, page }) {
  const [isNavOpened, setIsNavOpened] = useState(false)
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center 
    pb-20 pt-20
    lg:pb-24 lg:pl-24 lg:pt-12 
    ">
      <div className={`bg-white w-full fixed top-0 left-0 py-4 px-4 border-b-gray-400 ${isNavOpened ? '' : 'shadow-lg shadow-indigo-50'} z-50 lg:hidden`}>
        <button onClick={() => setIsNavOpened(!isNavOpened)}>
        <MenuIcon className={'w-8 h-8'} />
        </button>
      </div>
      <div
        className={`fixed left-0 top-0 h-screen  flex-col bg-white gap-2 pl-4 pr-10 pt-16 lg:pt-6
      shadow-lg
      w-screen ${isNavOpened ? '' : 'hidden'}
      lg:w-fit lg:flex z-40`}>
        <div className="text-gray-700 uppercase text-2xl mb-10 mt-5 font-medium text-start lg:text-center justify-center">
        Learning<span className="text-indigo-500">System</span>
        </div>
        <div className="pb-10 flex flex-col gap-2 flex-1">
          <NavLink
            link={'/'}
            title={
              <div className="flex gap-3">
                <UserIcon className={`w-7 h-7`} />
                Профіль
              </div>
            }
            active={page === 'profile'}
          />
          <NavLink
            link={'/courses'}
            title={
              <div className="flex gap-3">
                <CoursesIcon className={`w-7 h-7`} />
                Курси
              </div>
            }
            active={page === 'courses'}
          />
          {role === 'teacher' && (
            <NavLink
              link={'/groups'}
              title={
                <div className="flex gap-3">
                  <GroupsIcon className={`w-7 h-7`} />
                  Групи
                </div>
              }
              active={page === 'groups'}
            />
          )}
          {role === 'student' && (
             <NavLink
             link={'/mygroup'}
             title={
               <div className="flex gap-3">
                 <GroupsIcon className={`w-7 h-7`} />
                 Моя група
               </div>
             }
             active={page === 'groups'}
           />
          )}
        </div>
        <div className="py-4">
          <NavLink
            link={'/logout'}
            title={
              <div className="flex gap-3">
                <LogoutIcon className={`w-5 h-5`} />
                Вийти
              </div>
            }
          />
        </div>
      </div>
      {children}
    </div>
  )
}
