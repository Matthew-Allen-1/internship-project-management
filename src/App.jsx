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
  taskIds: [], 
  selected: false,
  activeSidebar: false
}

let defaultTaskState = {
  ...defaultInputState,
  id: 0,
}

const queryClient = new QueryClient();

export default function App() {
  const btnRef = useRef();
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [input, setInput] = useState(defaultInputState);
  const [groupData, setGroupData] = useState([allTasksGroupState, unscheduledTasksGroupState]);//stores all group data. 
  const [taskData, setTaskData] = useState([defaultTaskState]); //stores all task data.  I don't think this will work in the long run. 
  //probably need form tag around all the data in CreateTask jsx
  const [groupSelection, setGroupSelection] = useState(0)
  const [groupSidebarStyles, setGroupSideBarStyles] = useState([])

  
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

// switches dropdown to active on click
  function dropdown(){
    // console.log("dropdown function called");
    setDropdownSearch("");
    setDropdownActive(prevDrop => !prevDrop);
  };

// adds group to list if enter key is pressed and checks repeats
  function dropdownEnter(event){

    // console.log("dropdownEnter function called");
    const {name, value} = event.target
    if(event.key !== "Enter") return;
    
    let noMatches = true;
    for(let i = 0; i < groupData.length; i++){
      if(groupData[i].title.toUpperCase() === dropdownSearch.toUpperCase()){
        noMatches = false;
      }
    }

    if(noMatches){
      let newGroupId = nanoid(); 
      setInput(prevValues => ({
        ...prevValues,
        [name]: value,
        groupId: newGroupId
      }))
      setGroupData(prevData => prevData.map(group => ({...group, selected: false})))
      setGroupData(prevData => [...prevData, {id: newGroupId, title: dropdownSearch, taskIds: [], selected: true}])
      setInput(prevInput => ({...prevInput, groupId: newGroupId, groupTitle: dropdownSearch}))
    }
    setDropdownActive(prevDrop => !prevDrop);
  };

//updates search bar state
  function dropdownFilter(event) {
    // console.log("dropdownFilter function called");
    setDropdownSearch(event.target.value);
  };

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

  // makes options clickable in dropdown and Selects them to show
    function groupSelected(groupTitle){
      // console.log("groupSelected function called");
      setGroupData(prevGroupData => prevGroupData.map(group => {
        if(group.title.toUpperCase() === groupTitle.toUpperCase()){
          setInput({...input, groupTitle: group.title, groupId: group.id})
          return {...group, selected: true}
        } else {
          return {...group, selected: false}
        }
      }))
      setDropdownActive(prevDrop => !prevDrop);
    }

  // handles input changes except group
    function handleInputChange(event){
      // console.log("handleInputChange function called");
      const{name, value} = event.target;
      setInput(prevInput => ({
        ...prevInput,
        [name]: value
      }))
    }

  // adds the 'input' state into the currently selected group in 'groupData' state.
    function addTask(){
      // console.log("addTask function called");
      if(input.title == '') {
        alert('You must enter a task description.')
      }
      else {
        const newTaskId = nanoid()
        setTaskData(prevTaskData => {
          return([...prevTaskData, {...input, id: newTaskId}])
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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home
            dropdown={dropdown} 
            dropdownActive={dropdownActive} 
            dropdownFilter={dropdownFilter} 
            dropdownSearch={dropdownSearch} 
            groupData={groupData} 
            dropdownEnter={dropdownEnter}
            handleInputChange={handleInputChange}
            input={input}
            addTask={addTask}
            groupSelected={groupSelected}
            btnRef={btnRef}
            taskData={taskData}
            groupSelection={groupSelection}
            groupSidebarStyles={groupSidebarStyles}
            handleGroupSelection={handleGroupSelection}
            />}
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

