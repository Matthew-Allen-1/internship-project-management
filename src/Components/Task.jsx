import React from 'react'
import '../styling/Task.css'

export default function Task(){
  console.log(new Date());
  return(
    <div className="created-task">
      <input className="input" defaultValue="Task that was added" type="text" />
      <ul>
        <li>The Group that was chosen</li>
      </ul>
      <span className="line-divider"></span>
      <div className="time">
        <input defaultValue="12:00" type="time" />
        <div className="time-divider">-</div>
        <input defaultValue="12:01" type="time" />
      </div>
      <input className="date" type="date" />
      <span className="line-divider"></span>
      <img className="options" src="https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt="" />
    </div>
  )
}