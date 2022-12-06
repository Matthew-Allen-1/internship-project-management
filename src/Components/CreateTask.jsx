import React, {useState} from 'react'
import '../styling/CreateTask.css'

export default function CreateTask(props){
  const classList = props.dropdownActive ? "dropdown-content show" : "dropdown-content";
 
  // hard coded text and values is meant to be replaced by state data.
  return(
    <div className="create-task">
      <input className="input" placeholder="Input task here..."type="text" />

      <div className="dropdown">
        <div className="group dropbtn" onClick={() => props.dropdown(event)}>
          <img src="https://app.clockify.me/assets/ui-icons/plus-blue-req.svg" alt="" />
          <p>Group</p>
        </div>
        <div id="myDropdown" className={classList}>
          <input type="text" placeholder="Search/Create..." id="myInput" onKeyUp={() => filterFunction()} />
          <p href="#about">About</p>
          <p href="#base">Base</p>
          <p href="#blog">Blog</p>
          <p href="#contact">Contact</p>
          <p href="#custom">Custom</p>
          <p href="#support">Support</p>
          <p href="#tools">Tools</p>
        </div>
      </div>

      {/* <div className="group" onClick={() => props.dropdown(event)}>
        <img src="https://app.clockify.me/assets/ui-icons/plus-blue-req.svg" alt="" />
        <p>Group</p>
      </div> */}
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