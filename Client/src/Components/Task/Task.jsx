// Libraries
import React from 'react'
import {nanoid} from 'nanoid'
import { useMutation, useQueryClient } from 'react-query'

import { deleteTaskRequest } from '../../ApiServices/TasksService'

import useMutationAddTask from '../../hooks/useMutationAddTask';

import { defaultInputState } from '../../data/DefaultData';

// Styling
import './Task.css'
import OptionsMenu from '../OptionsMenu';
// import OptionsDropDown from '../OptionsDropDown';


export default function Task(props){

  const {groupData, task, handleInputChange, dropdown, dropdownEnter, dropdownFilter, dropdownSelected, taskDropdownSearch} = props;
  const taskBtnRef = React.useRef();
  const queryClient = useQueryClient();
  const newClassList = task.dropdown_active ? "task-dropdown-content task-dropdown-show" : "task-dropdown-content";
  
  // displays elements in dropdown
  const newGroupListElements = groupData.map(group => {
    if (taskDropdownSearch == "" || group.title.toUpperCase().indexOf(taskDropdownSearch.toUpperCase()) === 0) {
      return <p key = {group.group_id} id = {group.group_id} className = {'group-list#' + task.task_id} onClick={() => dropdownSelected(event, false)}>{group.title}</p>
    }
    else {return}
  })

  const { mutate: mutateDeleteTask } = useMutation(
    (id) => deleteTaskRequest(id),
    {
      onSuccess: () => queryClient.invalidateQueries(['tasks'])
    }
  );

  const { mutate: mutateAddTask } = useMutationAddTask();

  function deleteTask() {
    mutateDeleteTask(task.task_id)
  }

  function duplicateTask() {
    mutateAddTask({...defaultInputState ,...task, task_id: nanoid()})
  }

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
              onChange = {() => handleInputChange(event, false)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className="task-dropdown">
            <div className="group task-drop-btn" onClick={() => dropdown(event, false)}>
              <p key = {task.group_id} id = {'group#' + task.task_id} ref = {taskBtnRef}>{task.group_title}</p>
            </div>
            <div id="task-group-dropdown" className={newClassList} >
              <input 
                type = "text" 
                value = {taskDropdownSearch} 
                placeholder = "Search/Create..." 
                className = "task-dropdown-input"
                id = {'dropdown-input#' + task.task_id}
                name = "group" 
                onChange = {() => dropdownFilter(event, false)} 
                onKeyDown = {() => dropdownEnter(event, false)}
              />
              {newGroupListElements}
            </div>
          </div>
          <div className="task-elapsed-time">
            <div className = "elapsed-time-container">
              <span className="elapsed-time">{props.elapsedTime != '0:00' ? 'Duration: ' + props.elapsedTime : ''}</span>
              <span className="elapsed-time-format">{props.elapsedTime != '0:00' ? '(hh:mm)' : ''}</span>
            </div>
            <OptionsMenu id={task.task_id} deleteTask={deleteTask} duplicateTask={duplicateTask} />
          </div>
        </div>
        <div className="right-box">
          <span className="line-divider"></span>
          <div className="task-time">
            <input 
              id = {'start_time#' + task.task_id}
              name = "start_time"
              defaultValue = {task.start_time}  
              type = "time" 
              onChange = {() => handleInputChange(event, false)} 
            />
            <div className="time-divider">-</div>
            <input 
              id = {'end_time#' + task.task_id}
              name = "end_time"
              defaultValue = {task.end_time} 
              type = "time"
              onChange = {() => handleInputChange(event, false)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className = "task-date">
            <input 
              className = "date" 
              id = {'date#' + task.task_id}
              type = "date" 
              defaultValue = {task.date} 
              name = "date"
              onChange = {() => handleInputChange(event, false)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className="task-elapsed-time">
            <div className = "elapsed-time-container">
              <span className="elapsed-time">{props.elapsedTime != '0:00' ? 'Duration: ' + props.elapsedTime : ''}</span>
              <span className="elapsed-time-format">{props.elapsedTime != '0:00' ? '(hh:mm)' : ''}</span>
            </div>
            <OptionsMenu id={task.task_id} deleteTask={deleteTask} duplicateTask={duplicateTask} />
          </div>
        </div>
      </div>
    </div>
  )
}