import React from 'react'
import '../styling/CreateTask.css'

export default function CreateTask(){
  return(
    <div className="create-task">
      <input className="input" placeholder="Input task here..."type="text" />
      <div className="group">
        <img src="https://app.clockify.me/assets/ui-icons/plus-blue-req.svg" alt="" />
        <p>Group</p>
      </div>
      <span className="line-divider"></span>
      <div className="time">
        <input type="time" />
        <div className="time-divider">-</div>
        <input type="time" />
      </div>
      <input className="date" type="date" />
      <span className="line-divider"></span>
      <button>ADD</button>
      <img className="options" src="https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt="" />
    </div>
  )
}