import React from 'react'
import '../styling/GroupedTask.css'
import Task from './Task'

export default function GroupedTask(props){
  return(
    <div>
      <div className="task-header">
        <p className="left" >Fri, Dec 2</p>
        <div className="right">
          <p>Total: 00:01:00</p>
          <img src="https://app.clockify.me/assets/ui-icons/bulk-edit.svg" alt="" />
        </div>
      </div>
      <Task />
      <Task />
    </div>
  )
}