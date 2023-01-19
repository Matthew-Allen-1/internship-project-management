// Libraries
import React from 'react'
import {nanoid} from 'nanoid'

// Styling
import './Task.css'


export default function Task(props){

  const {groupData, task, handleInputChange, dropdown, dropdownEnter, dropdownFilter, dropdownSelected, taskDropdownSearch} = props;

  const taskBtnRef = React.useRef();
  const newClassList = task.dropdownActive ? "task-dropdown-content task-dropdown-show" : "task-dropdown-content";
  
  // let elapsedTime = ''

  // function calcElapsedTime(task) {
  //   const endTimeInMinutes = parseInt(task.endTime.slice(0, 2)) * 60 + parseInt(task.endTime.slice(3, 5))
  //   const startTimeInMinutes = parseInt(task.startTime.slice(0, 2)) * 60 + parseInt(task.startTime.slice(3, 5))
  //   const duration = endTimeInMinutes - startTimeInMinutes
  //   const absDuration = duration < 0 ? (duration + 24 * 60) : duration
  //   const hoursElapsed = Math.floor(absDuration / 60)
  //   const minutesElapsed = ''.concat((absDuration % 60) < 10 ? '0' : '', (absDuration % 60).toString())
  //   return (hoursElapsed.toString() + ":" + minutesElapsed.toString())
  // }
 
  // if(task.startTime && task.endTime) {elapsedTime = calcElapsedTime(task)}

  // displays elements in dropdown
  const newGroupListElements = groupData.map(group => {
    if (group.id != 0 && group.id != 1) {
      if (taskDropdownSearch == "" || group.title.toUpperCase().indexOf(taskDropdownSearch.toUpperCase()) === 0) {
        return <p key = {group.id} id = {group.id} className = {'group-list#' + task.id} onClick={() => dropdownSelected(event)}>{group.title}</p>
      }
    } 
    else {return}
  })


  const handleClick = () => {
    deleteTaskById(task.id);
  };

  // handles click outside dropdown menu

  // React.useEffect(() =>{
  //   const closeTaskDropdown = e => {
  //     if(e.composedPath()[0] !== taskBtnRef){
  //       setTaskData(prevTaskData => prevTaskData.map(prevTask => ({...prevTask, dropdownActive: false})))
  //     }
  //   }
  //   setTaskDropdownActive(prevTaskDropdownActive => !prevTaskDropdownActive);
  //   document.body.addEventListener('click', closeTaskDropdown);
  //   return () => document.body.removeEventListener('click', closeTaskDropdown);
  // }, [])

  //displays information about each task
  return(
    <div className="created-task-container">
      <div className="created-task">
        <div className="left-box">
          <div className="check-input-time">
            {props.selectAll && <input type="checkbox"/>}
            <input 
              className = "input"
              id = {'title#' + task.id}
              defaultValue = {task.title}
              type = "text" 
              name = "title"
              onChange = {() => handleInputChange(event)} 
            />
            <span className="elapsed-time">Time: {props.elapsedTime}</span>
          </div>
          <div className="task-dropdown">
            <div className="group task-drop-btn" onClick={() => dropdown(event)}>
              <p key = {task.groupId} id = {'group#' + task.id} ref = {taskBtnRef}>{task.groupTitle}</p>
            </div>
            <div id="task-group-dropdown" className={newClassList} >
              <input 
                type = "text" 
                value = {taskDropdownSearch} 
                placeholder = "Search/Create..." 
                className = "task-dropdown-input"
                id = {'dropdown-input#' + task.id}
                name = "group" 
                onChange = {() => dropdownFilter(event)} 
                onKeyDown = {() => dropdownEnter(event)}
              />
              {newGroupListElements}
            </div>
          </div>
        </div>

        <div className="right-box">
          <span className="line-divider"></span>
          <div className="time">
            <input 
              id = {'startTime#' + task.id}
              name = "startTime"
              defaultValue = {task.startTime}  
              type = "time" 
              onChange = {() => handleInputChange(event)} 
            />
            <div className="time-divider">-</div>
            <input 
              id = {'endTime#' + task.id}
              name = "endTime"
              defaultValue = {task.endTime} 
              type = "time"
              onChange = {() => handleInputChange(event)} 
            />
          </div>
          <input 
            className = "date" 
            id = {'date#' + task.id}
            type = "date" 
            defaultValue = {task.date} 
            name = "date"
            onChange = {() => handleInputChange(event)} 
          />
          <span className="line-divider"></span>
          <span className="elapsed-time">Time: {props.elapsedTime}</span>
          <img className="options" src="https://app.clockify.me/assets/ui-icons/menu-dots-vertical.svg" alt="" />
        </div>
      </div>
    </div>
  )
}