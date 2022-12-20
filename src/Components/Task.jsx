import React from 'react'
import '../styling/Task.css'

export default function Task(props){
 
  //displays information about each task
  return(
    <div className="created-task">
      <input className="input" defaultValue={props.task.title} type="text" />
      <ul>
        <li>{props.task.groupTitle}</li>
      </ul>
      <span className="line-divider"></span>
      <div className="time">
        <input defaultValue = {props.task.startTime} type="time" />
        <div className="time-divider">-</div>
        <input defaultValue = {props.task.endTime} type="time" />
      </div>
      <input className="date" type="date" defaultValue= {props.task.date}/>
      <span className="line-divider"></span>
      {/* <img className="options" src="https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt="" /> */}

{/* option drop down */}
<div className="menu-nav">
        <div className="menu-item">Group Item</div>
        <div className="dropdown-container" tabIndex="-1">
          <div className="three-dots"></div>
          <div className="dropdown">
            <a href="#"><div>dropdown 1</div></a>
            <a href="#"><div>dropdown 2</div></a>
            <a href="#"><div>dropdown 3</div></a>
          </div>
        </div>
      </div> 


    </div>
  )
}