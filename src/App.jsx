import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { QueryClientProvider, QueryClient } from 'react-query'
import { useQuery, useMutation } from 'react-query'

// import { addTask } from '../ApiServices/TasksService'

import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import {nanoid} from 'nanoid'
import './index.css'
import {HardCodedGroupData} from './Components/HardCodedGroupData'
import {HardCodedTaskData} from './Components/HardCodedTaskData'

const queryClient = new QueryClient();

let defaultInputState = {
  title: "",
  groupTitle: "",
  groupId: 0,
  startTime: "",
  endTime: "",
  date: ""
}

let allTasksGroupState = {
  id: 0, 
  title: "Group", 
  taskIds: [], 
  selected: true,
  activeSidebar: true
}

let unscheduledTasksGroupState = {
  id: 1, 
  title: "Unscheduled Tasks", 
  taskIds: ['000', '123'], 
  selected: false,
  activeSidebar: false
}

let defaultTaskState = {
  ...defaultInputState,
  id: 0,
  dropdownActive: false,
}

export default function App() {

  const btnRef = useRef();
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [input, setInput] = useState(defaultInputState);

  //The following declarations include some pre-loaded data.
  const [groupData, setGroupData] = useState([allTasksGroupState, unscheduledTasksGroupState, ...HardCodedGroupData]);  //stores all group data. 
  const [taskData, setTaskData] = useState([defaultTaskState, ...HardCodedTaskData]); //stores all task data.  I don't think this will work in the long run. 
  //probably need form tag around all the data in CreateTask jsx

  const [groupSelection, setGroupSelection] = useState(0)
  const [groupSidebarStyles, setGroupSideBarStyles] = useState([])
  const [taskDropdownSearch, setTaskDropdownSearch] = useState('')
  const [taskDropdownActive, setTaskDropdownActive] = useState(false)

  // Changes the group selection in the sidebar on click.
  function handleGroupSelection(event, index) {

    //Set the newly selected group in the sidebar
    const selectedGroupId = groupData[index].id
    setGroupSelection(selectedGroupId)

    //Construct an array of group id's representing groups in the sidebar.
    const sidebarGroups = groupData.map(group => group.id)

    //Assign background color styles to the sidebar groups.
    setGroupSideBarStyles(sidebarGroups.map((groupId) => {
      if (groupId == selectedGroupId) {return {backgroundColor: '#c4eaee'}}
      else {return {backgroundColor: 'white'}}
    }))
  }

  // handles input changes except group
  function handleInputChange(event){
    // console.log("handleInputChange function called");
    const{name, value} = event.target;
    console.log('eventTargetId', event.target.id)
    console.log('eventTargetClassName', event.target.className)
    console.log(event.target.className.indexOf("create-task-input"))

    //handles input changes on the create task
    if(event.target.className.indexOf("create-task-input") >= 0) {
      setInput(prevInput => ({...prevInput, [name]: value}))
    }

    //handles input changes on a task from the task list
    else {
      setTaskData(prevTaskData => prevTaskData.map(prevTask => {
        if (event.target.id == name + '#' + prevTask.id) {return ({...prevTask, [name]: value})}
        else {return prevTask}
      }))
    }
  } 

  // switches dropdown to active on click
  function dropdown(event) {
    // handles a click on the create task dropdown
    if (event.target.className.indexOf('create-task-dropdown') >= 0) {
      setDropdownSearch("");
      setDropdownActive(prevDrop => !prevDrop);
    }
    // handles a click on a task list dropdown
    else {
      // slices off "group#" from the event.target.id to get the current task id
      const currTaskId = event.target.id.slice(6)

      setTaskData(prevTaskData => prevTaskData.map(prevTask => {
        if(currTaskId == prevTask.id) {
          const newDropdownActive = !prevTask.dropdownActive
          setTaskDropdownActive(prevTaskDropDownActive => !prevTaskDropDownActive)
          return {...prevTask, dropdownActive: newDropdownActive}
        }
        else {return prevTask}
      }))
      setTaskDropdownSearch("");
    }
  };

  // adds group to list if enter key is pressed and checks repeats
  function dropdownEnter(event){
    const createTaskDropdown = (event.target.id == 'create-dropdown-input')
    const {name, value} = event.target

    //check to see if user pressed "Enter"
    if(event.key !== "Enter") {return}
    
    //check to see if the entered group name is new
    let noMatches = true;
    for(let i = 0; i < groupData.length; i++){
      if(groupData[i].title.toUpperCase() === (createTaskDropdown ? dropdownSearch.toUpperCase() : taskDropdownSearch.toUpperCase()) ){
        noMatches = false;
      }
    }

    //if the entered group name is new, add the new group to groupData
    if(noMatches){
      let newGroupId = nanoid(); 
      
      //handles the addition of a new group on the create task dropdown
      if (createTaskDropdown) {
        setInput(prevValues => ({
          ...prevValues,
          [name]: value,
          groupId: newGroupId
        }))
        setGroupData(prevGroupData => prevGroupData.map(group => ({...group, selected: false})))
        setGroupData(prevGroupData => [...prevGroupData, {id: newGroupId, title: dropdownSearch, taskIds: [], selected: true}])
        setInput(prevInput => ({...prevInput, groupId: newGroupId, groupTitle: dropdownSearch}))
      }

      //handles the addition of a new group on a task list dropdown
      else {
        // slices off "drop-down-enter#" from the event.target.id to get the current task id
        const currTaskId = event.target.id.slice(15)
        const currTask = taskData.filter(task => task.id == currTaskId)[0]

        setGroupData(prevGroupData => [...prevGroupData.map(prevGroup => {
          if (currTask.groupId == prevGroup.id && event.target.id != prevGroup.id) {
            const prevTaskIds = prevGroup.taskIds
            prevTaskIds.splice(prevTaskIds.indexOf(currTaskId), 1)
            return ({...prevGroup, taskIds: [...prevTaskIds]})
          }
          else {return prevGroup}
        }), {id: newGroupId, title: taskDropdownSearch, taskIds: [currTaskId], selected: false}])
    
        setTaskData(prevTaskData => prevTaskData.map(prevTask => {
          if (currTaskId == prevTask.id) {
            const newDropdownActive = !prevTask.dropdownActive
            return {...prevTask, dropdownActive: newDropdownActive, groupId: newGroupId, groupTitle: taskDropdownSearch}
          }
          else {return prevTask} 
        }))
      }
    }
    createTaskDropdown ? setDropdownActive(prevDropdownActive => !prevDropdownActive) : setTaskDropdownActive(prevTaskDropdownActive => !prevTaskDropdownActive)
  };

  //updates search bar state
  function dropdownFilter(event) {
    //updates search bar on the create task dropdown
    if (event.target.id == 'create-dropdown-input') {setDropdownSearch(event.target.value)}
    //updates search bar on a task list dropdown
    else {setTaskDropdownSearch(event.target.value)}
  }

  // handles click outside dropdown menu
  useEffect(() =>{
    // console.log("useEffect function called");
    const closeDropdown = e => {
      if(e.composedPath()[0] !== btnRef.current && e.target.name !== 'group'){
        setDropdownActive(prevDrop => false);
      }
    }
    document.body.addEventListener('click', closeDropdown);
    return () => document.body.removeEventListener('click', closeDropdown);
  }, [])

  // makes options clickable in dropdown and selects them to show
  function dropdownSelected(event){
    console.log('eventTargetId', event.target.id)
    console.log('eventTargetClassName', event.target.className)
    const createDropdown = (event.target.className == 'create-dropdown-group')

    // gets the current group id from the event.target.id
    const currGroupId = event.target.id
    const currGroup = groupData.filter(group => group.id == currGroupId)[0]
    console.log('currGroup', currGroup)

    // handles a selection in the create task dropdown
    if (createDropdown) {
      setGroupData(prevGroupData => prevGroupData.map(group => {
        if(group.title.toUpperCase() === currGroup.title.toUpperCase()){
          setInput({...input, groupTitle: group.title, groupId: group.id})
          return {...group, selected: true}
        } else {
          return {...group, selected: false}
        }
      }))
    }

    // handles a selection in a task list dropdown 
    else {
      // slices off "group-list#" from the event.target.id to get the current task id
      const currTaskId = event.target.className.slice(11)
      const currTask = taskData.filter(task => task.id == currTaskId)[0]
      console.log('currTask', currTask)

      setGroupData(prevGroupData => prevGroupData.map(prevGroup => {
        // if the current task belongs to this group and this group was not selected, delete the current task from this group
        if (currTask.groupId == prevGroup.id && currGroupId != prevGroup.id) {
          const prevTaskIds = prevGroup.taskIds
          prevTaskIds.splice(prevTaskIds.indexOf(currTaskId), 1)
          return ({...prevGroup, taskIds: [...prevTaskIds]})
        }
        // else if the current task does not belong to this group, and this is the selected group
        else if (currTask.groupId != prevGroup.id && currGroupId == prevGroup.id) {
          setTaskData(prevTaskData => prevTaskData.map(prevTask => {
            //if this is the current task, switch its dropdownActiveState and update its group info to the selected group
            if (currTaskId == prevTask.id) {
              const newDropdownActive = !prevTask.dropdownActive
              return {...prevTask, dropdownActive: newDropdownActive, groupId: prevGroup.id, groupTitle: prevGroup.title}
            }
            else {return prevTask} 
          }))
          // also, add the current task id to the taskIds array for this selected group
          const newTaskIds = prevGroup.taskIds
          return({...prevGroup, taskIds: [...newTaskIds, currTaskId]})
        }
        else {return prevGroup}
      }))
    }
    createDropdown ? setDropdownActive(prevDrop => !prevDrop) : setTaskDropdownActive(prevTaskDropDownActive => !prevTaskDropDownActive)
  }

  // adds the 'input' state into the currently selected task in 'taskData' state.
  function addTask(){
    // console.log("addTask function called");
    if (input.title == '') {alert('You must enter a task description.')}
    else {
      const newTaskId = nanoid()
      setTaskData(prevTaskData => {
        return([...prevTaskData, {...input, id: newTaskId, dropdownActive: false}])
      })
      setGroupData(prevGroupData => prevGroupData.map(group => {
        if (group.id == 1 && input.date == '') {
          return ({...group, taskIds: [...group.taskIds, newTaskId]})
        }
        else if (!group.selected) {return group}
        else {
          return ({...group, taskIds: [...group.taskIds, newTaskId]})
        }
      }))
    }
    console.log('Task Data After Add Task: ', taskData)
    console.log('Group Data After Add Task: ', groupData)
  }
  
  return (
    <QueryClientProvider client = {queryClient}>
      <Router>
        <Routes>
          <Route path = "/" element = {<Home
            groupData = {groupData} 
            setGroupData = {setGroupData}
            taskData = {taskData}
            setTaskData = {setTaskData}
            input = {input}
            handleInputChange = {handleInputChange}
            addTask = {addTask}

            groupSelection = {groupSelection}
            handleGroupSelection = {handleGroupSelection}
            groupSidebarStyles = {groupSidebarStyles}
          
            btnRef = {btnRef}
            dropdown = {dropdown} 
            dropdownActive = {dropdownActive} 
            dropdownEnter = {dropdownEnter}
            dropdownFilter = {dropdownFilter} 
            dropdownSearch = {dropdownSearch} 
            dropdownSelected = {dropdownSelected}

            taskDropdownActive = {taskDropdownActive}
            setTaskDropdownActive = {setTaskDropdownActive}
            taskDropdownSearch = {taskDropdownSearch}
            setTaskDropdownSearch = {setTaskDropdownSearch}
            />}
          />
          <Route path = "/Login" element = {<Login />} />
          <Route path = "/SignUp" element = {<SignUp />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

