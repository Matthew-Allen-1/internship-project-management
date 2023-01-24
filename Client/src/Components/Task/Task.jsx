// Libraries
import React from 'react'
import {nanoid} from 'nanoid'

// Styling
import './Task.css'
import OptionsMenu from '../OptionsMenu';
// import OptionsDropDown from '../OptionsDropDown';


export default function Task(props){

  const {groupData, task, handleInputChange, dropdown, dropdownEnter, dropdownFilter, dropdownSelected, taskDropdownSearch} = props;
  const taskBtnRef = React.useRef();
  const newClassList = task.dropdownActive ? "task-dropdown-content task-dropdown-show" : "task-dropdown-content";
  
  // displays elements in dropdown
  const newGroupListElements = groupData.map(group => {
    if (group.group_id != 0 && group.group_id != 1) {
      if (taskDropdownSearch == "" || group.title.toUpperCase().indexOf(taskDropdownSearch.toUpperCase()) === 0) {
        return <p key = {group.group_id} id = {group.group_id} className = {'group-list#' + task.task_id} onClick={() => dropdownSelected(event)}>{group.title}</p>
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
          <div className="task-input">
            {props.selectAll && <input type="checkbox"/>}
            <input 
              className = "input"
              id = {'title#' + task.task_id}
              defaultValue = {task.title}
              type = "text" 
              name = "title"
              onChange = {() => handleInputChange(event)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className="task-dropdown">
            <div className="group task-drop-btn" onClick={() => dropdown(event)}>
              <p key = {task.groupId} id = {'group#' + task.task_id} ref = {taskBtnRef}>{task.group_title}</p>
            </div>
            <div id="task-group-dropdown" className={newClassList} >
              <input 
                type = "text" 
                value = {taskDropdownSearch} 
                placeholder = "Search/Create..." 
                className = "task-dropdown-input"
                id = {'dropdown-input#' + task.task_id}
                name = "group" 
                onChange = {() => dropdownFilter(event)} 
                onKeyDown = {() => dropdownEnter(event)}
              />
              {newGroupListElements}
            </div>
          </div>
          <div className="task-elapsed-time">
            <span className="elapsed-time">{props.elapsedTime != '0:00' ? 'Time: ' + props.elapsedTime : ''}</span>
            <OptionsMenu />
          </div>
        </div>
        <div className="right-box">
          <span className="line-divider"></span>
          <div className="task-time">
            <input 
              id = {'startTime#' + task.task_id}
              name = "startTime"
              defaultValue = {task.start_time}  
              type = "time" 
              onChange = {() => handleInputChange(event)} 
            />
            <div className="time-divider">-</div>
            <input 
              id = {'endTime#' + task.task_id}
              name = "endTime"
              defaultValue = {task.end_time} 
              type = "time"
              onChange = {() => handleInputChange(event)} 
            />
          </div>
          <input 
            className = "date" 
            id = {'date#' + task.task_id}
            type = "date" 
            defaultValue = {task.date} 
            name = "date"
            onChange = {() => handleInputChange(event)} 
          />
          <span className="line-divider"></span>
          <div className = "task-date">
            <input 
              className = "date" 
              id = {'date#' + task.id}
              type = "date" 
              defaultValue = {task.date} 
              name = "date"
              onChange = {() => handleInputChange(event)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className="task-elapsed-time">
            <span className="elapsed-time">{props.elapsedTime != '0:00' ? 'Time: ' + props.elapsedTime : ''}</span>
            <OptionsMenu />
          </div>
        </div>
      </div>
    </div>
  )
}