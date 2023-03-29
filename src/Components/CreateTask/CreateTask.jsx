// Libraries
import React, {startTransition, useState} from 'react'

// styling
import './CreateTask.css'

export default function CreateTask(props){

  const {groupData, input, handleInputChange, addTask, btnRef, 
    dropdown, dropdownActive, dropdownEnter, dropdownFilter, dropdownSearch, dropdownSelected} = props;

  const classList = dropdownActive ? "dropdown-content show" : "dropdown-content";
  
  // displays elements in dropdown
  const groupListElements = groupData.map(group => {
    if(group.id != 0 && group.id != 1) {
      if(dropdownSearch == "") {
        return <p key = {group.id} id = {group.id} className = "create-dropdown-group" onClick={() => dropdownSelected(event)}>{group.title}</p>
      } 
      else if (group.title.toUpperCase().indexOf(dropdownSearch.toUpperCase()) === 0 && group.title != "Group") {
        return <p key = {group.id} id = {group.id} className = "create-task-dropdown-group" onClick={() => dropdownSelected(event)}>{group.title}</p>
      }
    }
  })

  // switches group name to name of current group selected
  const groupElement = groupData.map(group => {
    if(group.selected == true) {return <p key = {group.id} className = "create-task-dropdown" ref = {btnRef}>{group.title}</p>}
  })

  return(
    <div className = "create-task">
      <input 
        className="input create-task-input" 
        id="create-task-title-input"
        placeholder="Input coding prompt here..."
        type="text"
        name="title"
        value={input.title}
        onChange={() => handleInputChange(event)} 
      />
      <div className = "dropdown create-task-dropdown" >
        <div className = "group dropbtn create-task-dropdown" onClick = {() => dropdown(event)}>
          <img className = "create-task-dropdown" src = "https://app.clockify.me/assets/ui-icons/plus-blue-req.svg" alt = "" />
          {groupElement}
        </div>
        <div id = "group-dropdown" className = {classList} >
          <input 
            type = "text" 
            className = ""
            value = {dropdownSearch} 
            placeholder = "Search/Create..." 
            id = "create-dropdown-input"
            name = "group" 
            onChange = {() => dropdownFilter(event)} 
            onKeyDown = {() => dropdownEnter(event)}
          />
          {groupListElements}
        </div>
      </div>

      <span className = "line-divider"></span>
      <div className = "time">
        <input 
          className = "time create-task-input"
          type = "time" 
          name = "startTime"
          value = {input.startTime}
          onChange = {() => handleInputChange(event)}
        />
        <div className = "time-divider">-</div>
        <input 
          className = "time create-task-input"
          type = "time"
          name = "endTime"
          value = {input.endTime}
          onChange = {() => handleInputChange(event)} 
        />
      </div>
      <input 
        className = "date create-task-input" 
        type = "date" 
        name = "date"
        value = {input.date}
        onChange = {() => handleInputChange(event)} 
      />
      <span className = "line-divider"></span>
      <button onClick = {() => addTask()}>SEND</button>
      <img className = "options" src = "https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt = "" />
    </div>
  )
}