import React, { useRef, useEffect, useState, useContext } from 'react'

// Libraries
import {nanoid} from 'nanoid'
import { useMutation, useQueryClient } from 'react-query'

// API Requests
import { addGroupRequest, updateTaskRequest } from '../../ApiServices/TasksService'

// Hooks && Context
import { useMutationAddTask, useMutationDeleteTask, useMutationAddGroup, useMutationUpdateTask } from '../../hooks/useMutationHook';
import { UserContext } from '../../context/UserContext'

//Components
import OptionsMenu from '../OptionsMenu';

// default data
import { defaultInputState } from '../../data/DefaultData';

// Styling
import './Task.css'


export default function Task(props){
  const { newTaskMessage, updateNewTaskMessage }= useContext(UserContext);

  const {groupData, task} = props;
  const btnRef = useRef();
  const queryClient = useQueryClient();
  const [input, setInput] = useState({title: '', start_time: '', end_time:'', date:''})
  const [dropdownActive, setDropdownActive] = useState(false)
  const [dropdownSearch, setDropdownSearch] = useState(""); 
  const newClassList = dropdownActive ? "task-dropdown-content task-dropdown-show" : "task-dropdown-content";
  const { mutate: mutateDeleteTask } = useMutationDeleteTask();
  const { mutate: mutateUpdateTask } = useMutationUpdateTask();
  const { mutate: mutateAddTask } = useMutationAddTask();

  useEffect(() =>{
    const closeDropdown = e => {
      if(e.composedPath()[0] !== btnRef.current  && e.target.name !== 'group'){
        setDropdownActive(prevDrop => false);
      }
    }
    document.body.addEventListener('click', closeDropdown);
    return () => document.body.removeEventListener('click', closeDropdown);
  }, []);

  // mutate Add Group
  const { mutate: mutateAddGroup } = useMutation(
    (newGroup) => addGroupRequest(newGroup),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['tasks']);
        queryClient.invalidateQueries(['archived-tasks'])
        setDropdownActive(false);
        setDropdownSearch('');
        mutateUpdateTask({type: 'groupSelect', group_id: data.group_id, group_title: data.group_title, task_id: task.task_id})
      }
    }
  );

  function deleteTask() {mutateDeleteTask(task.task_id)};
  function duplicateTask() {mutateAddTask({...defaultInputState ,...task, task_id: nanoid()})};
  function archiveTask(name) {
    if(name == "Archive"){
      mutateUpdateTask({type:"archive", archived: true, task_id: task.task_id})
    } else if(name == "unArchive"){
      mutateUpdateTask({type:"archive", archived: false, task_id: task.task_id})
    }
  };



  // handles input changes
  function handleInputChange(event){
    const{name, value} = event.target;
    setInput(prevInput => ({...prevInput, [name]: value}))
  };

  // handles a click on the create task dropdown
  function dropdown() {
    setDropdownSearch("");
    setDropdownActive(prevDrop => !prevDrop);
  };

  // adds group to list if enter key is pressed and checks repeats
  function dropdownEnter(event){
    const {name, value} = event.target

    //check to see if user pressed "Enter"
    if(event.key !== "Enter") {return}
    
    //check to see if the entered group name is new
    let noMatches = true;
    for(let i = 0; i < groupData.length; i++){
      if(groupData[i].title.toUpperCase() === (dropdownSearch.toUpperCase())){
        noMatches = false;
      }
    }
    //if the entered group name is new, add the new group to groupData
    if(noMatches){
      let newGroupId = nanoid(); 
      mutateAddGroup({group_id: newGroupId, title: dropdownSearch, activeSidebar: false, selected: true});
    } else{
      // gets the current group id from the event.target.id
      const currGroup = groupData.filter(group => group.title == value)[0]
      mutateUpdateTask({type: 'groupSelect', group_id: currGroup.group_id, group_title: currGroup.title, task_id: task.task_id})
      setDropdownActive(false);
    }
  };

  //updates search bar state
  function dropdownFilter(event) {
   setDropdownSearch(event.target.value)
  };

  // makes options clickable in dropdown and selects them to show
  function dropdownSelected(event){
    const currGroupId = event.target.id
    groupData.forEach(group => {
      if(group.group_id === currGroupId) {
        mutateUpdateTask({type: 'groupSelect', group_id: group.group_id, group_title: group.title, task_id: task.task_id})
      }
    })
  };

  function onFocusOut(event){
    const name = event.target.name
    if(name === 'title' && task.title != input.title && input.title !== ''){
      mutateUpdateTask({type: 'title', title: input.title, task_id: task.task_id})
    } else if (name === 'start_time' && task.start_time !== input.start_time && input.start_time !== ''){
      mutateUpdateTask({type: 'start_time', start_time: input.start_time, task_id: task.task_id})
    } else if (name === 'end_time' && task.end_time !== input.end_time && input.end_time !== ''){
      mutateUpdateTask({type: 'end_time', end_time: input.end_time, task_id: task.task_id})
    } else if (name === 'date' && task.date !== input.date && input.date !== ''){
      mutateUpdateTask({type: 'date', date: input.date, task_id: task.task_id})
    }
  }




  // displays elements in dropdown
  const newGroupListElements = groupData.map(group => {
    if (dropdownSearch == "" || group.title.toUpperCase().indexOf(dropdownSearch.toUpperCase()) === 0) {
      return <p key = {group.group_id} id = {group.group_id} className = {'group-list'} onClick={(event) => dropdownSelected(event)}>{group.title}</p>
    } else {return}
  });

  //displays information about each task
  return(
    <div className="created-task-container">
      <div className="created-task">
        <div className="left-box">
          <div className="task-input">
            {props.selectAll && <input id={task.task_id} type="checkbox" onChange={(event) => props.handleCheckbox(event)}/>}
            <input
              className = "input"
              onBlur={(event) => onFocusOut(event)}
              id = {'title#' + task.task_id}
              defaultValue = {task.title}
              type = "text" 
              name = "title"
              onChange = {(event) => handleInputChange(event)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className="task-dropdown">
            <div className="group task-drop-btn" onClick={(event) => dropdown(event)}>
              <p key = {task.group_id} id = {'group#' + task.task_id} ref = {btnRef}>{task.group_title}</p>
            </div>
            <div id="task-group-dropdown" className={newClassList} >
              <input 
                type = "text" 
                value = {dropdownSearch} 
                placeholder = "Search/Create..." 
                className = "task-dropdown-input"
                id = {'dropdown-input#' + task.task_id}
                name = "group" 
                onChange = {(event) => dropdownFilter(event)} 
                onKeyDown = {(event) => dropdownEnter(event)}
              />
              {newGroupListElements}
            </div>
          </div>
          <span className="line-divider"></span>
          <div className="task-elapsed-time">
            <div className = "elapsed-time-container">
              <span className="elapsed-time">{props.elapsedTime != '0:00' ? 'Duration: ' + props.elapsedTime : ''}</span>
              <span className="elapsed-time-format">{props.elapsedTime != '0:00' ? '(hh:mm)' : ''}</span>
            </div>
          </div>
        </div>
        <div className="right-box">
          <span className="line-divider"></span>
          <div className="task-time">
            <input 
              id = {'start-time#' + task.task_id}
              name = "start_time"
              defaultValue = {task.start_time}  
              type = "time" 
              onBlur={(event) => onFocusOut(event)}
              onChange = {() => handleInputChange(event, false)} 
            />
            <div className="time-divider">-</div>
            <input 
              id = {'end-time#' + task.task_id}
              name = "end_time"
              defaultValue = {task.end_time} 
              type = "time"
              onBlur={(event) => onFocusOut(event)}
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
              onBlur={(event) => onFocusOut(event)}
              onChange = {() => handleInputChange(event, false)} 
            />
          </div>
          <span className="line-divider"></span>
          <div className="task-elapsed-time">
            <div className = "elapsed-time-container">
              <span className="elapsed-time">{props.elapsedTime != '0:00' ? 'Duration: ' + props.elapsedTime : ''}</span>
              <span className="elapsed-time-format">{props.elapsedTime != '0:00' ? '(hh:mm)' : ''}</span>
            </div>
          </div>
          <div className = "options-menu">
            <OptionsMenu  id={task.task_id} archived={task.archived} deleteTask={deleteTask} duplicateTask={duplicateTask} archiveTask={archiveTask} />
          </div>
        </div>
      </div>
    </div>
  )
}