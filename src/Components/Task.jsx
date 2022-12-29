import React from 'react'
import '../styling/Task.css'

export default function Task(props){
 
  //displays information about each task
  return(
    <div  className="created-task">
      <input className="input" defaultValue={props.task.title} type="text" />
      <ul>
        <li>{props.task.groupTitle}</li>
      </ul>
      <span className="line-divider"></span>
      <div className="time">
        <input defaultValue = {props.task.startTime}  type="time" />
        <div className="time-divider">-</div>
        <input defaultValue = {props.task.endTime} type="time" />
      </div>
      <input className="date" type="date" defaultValue= {props.task.date} />
      <span className="line-divider"></span>
      <img className="options" src="https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt="" />
    </div>
  )
}