import React from "react"
import DefaultBadge from "../Badges/DefaultBadge"

const SubgroupCard = ({ subgroup, index }) => (
  <div>
    {subgroup && (
      <>
      <div className="border-b border-indigo-300 text-indigo-500 dark:text-slate-400 flex justify-between">
      <div className="flex gap-2 items-baseline">
        <span className="text-lg">Підгрупа #{index}</span>
      </div>
    </div>
    <div className="pt-4 pb-7 flex flex-col gap-2">
      {subgroup.members_details.map((member, index) => (
        <div className="flex gap-2 items-baseline" key={index}>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 uppercase font-bold text-indigo-400">{member.fullName.substring(0,1)}</div>
          <div className={`${member.id === subgroup.leader_id ? 'text-indigo-500' : ''}`}>
            {member.id === subgroup.leader_id ? '⭐' : ''} {member.fullName}
          </div>
        </div>
      ))}
    </div></>
    )}
  </div>
)

export default SubgroupCard