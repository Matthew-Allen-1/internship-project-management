import React, {useState} from 'react'
import '../styling/CreateTask.css'

export default function CreateTask(props){
  const classList = props.dropdownActive ? "dropdown-content show" : "dropdown-content";
  
  // displays elements in dropdown
  const groupListElements = props.groupData.map(group => {
    if(props.search == "" && group.title != "Group"){
      return <p>{group.title}</p>
    } else if (group.title.toUpperCase().indexOf(props.search.toUpperCase()) === 0 && group.title != "Group"){
      return <p>{group.title}</p>
    }
  })

  // switches group name to name of current group selected
  const groupElement = props.groupData.map(group => {
    if(group.selected == true){ return <p>{group.title}</p>}
  })
 
  // hard coded text and values is meant to be replaced by state data.
  return(
    <div className="create-task">
      <input className="input" placeholder="Input task here..."type="text" onChange={() => props.title(event)}/>

      <div className="dropdown">
        <div className="group dropbtn" onClick={() => props.dropdown(event)}>
          <img src="https://app.clockify.me/assets/ui-icons/plus-blue-req.svg" alt="" />
          {groupElement}
        </div>
        <div id="myDropdown" className={classList}>
          <input 
            type="text" 
            value={props.search} 
            placeholder="Search/Create..." 
            id="myInput" 
            onChange={() => props.filter(event)} 
            onKeyDown={() => props.enter(event)}
          />
          {groupListElements}
        </div>
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