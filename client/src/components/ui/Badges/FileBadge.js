import React from 'react'
import { FileIcon } from '../../../assets/icons/file'

const FileBadge = (props) => {
  return (
    <div
      className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs flex items-center gap-1 fill-slate-500
    hover:bg-indigo-100 hover:text-indigo-600 hover:fill-indigo-600
    ease-in-out duration-300 transition-colors ">
      <FileIcon className={'w-4 h-4 text-gray-700'} />
      <a href={props.link} target="_blank" rel="noreferrer">
        {props.caption}
      </a>
    </div>
  )
}

export default FileBadge
