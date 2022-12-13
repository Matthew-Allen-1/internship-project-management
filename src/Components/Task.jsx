import React from 'react'
import '../styling/Task.css'

export default function Task(props){
 
  //displays information about each task
  return(
    <div className="created-task">
      <input className="input" defaultValue={props.taskData.title} type="text" />
      <ul>
        <li>{props.taskData.group}</li>
      </ul>
      <span className="line-divider"></span>
      <div className="time">
        <input defaultValue = {props.taskData.startTime} type="time" />
        <div className="time-divider">-</div>
        <input defaultValue = {props.taskData.endTime} type="time" />
      </div>
      <input className="date" type="date" defaultValue= {props.taskData.date}/>
      <span className="line-divider"></span>
      <img className="options" src="https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt="" />
    </div>
  )
}