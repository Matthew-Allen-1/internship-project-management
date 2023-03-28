import React, { useState, useEffect, useRef, useContext } from 'react'

// Libraries
import {nanoid} from 'nanoid'
import { useQuery, useQueryClient } from 'react-query'

// Hooks & Context
import { UserContext } from '../../context/UserContext'
import { useMutationAddTask, useMutationAddGroup } from '../../hooks/useMutationHook'

// Components
import Navbar from '../../Components/Navbar/Navbar'
import Sidebar from '../../Components/Sidebar/Sidebar'
import CreateTask from '../../Components/CreateTask/CreateTask'
import GroupedTask from '../../Components/GroupedTask/GroupedTask'
import Alert from '@mui/material/Alert'

// other Data
import { defaultInputState } from '../../data/DefaultData'

// API Requests
import { fetchTasks, fetchUser } from '../../ApiServices/TasksService'

// Styling
import './HomePage.css'


export default function Home(){
  const { currentUser, loginUser, theme, newTaskMessage }= useContext(UserContext);
  const queryClient = useQueryClient();
  const { data: backendData , isLoading: backendLoading, isError: backendError , refetch} = useQuery(
    'tasks', 
    fetchTasks,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: userData , isLoading: userLoading, isError: userError , refetch: userRefetch} = useQuery(
    'user', 
    fetchUser,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        loginUser(data)
      },
    }
  );

  const btnRef = useRef();
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [input, setInput] = useState(defaultInputState);
  const [groupSelection, setGroupSelection] = useState('default')
  const [selected, setSelected] = useState('')
  const { mutate: mutateAddTask } = useMutationAddTask();  
  const { mutate: mutateAddGroup } = useMutationAddGroup(setDropdownActive, setDropdownSearch, setInput, dropdownSearch, 'create')
  
  // handles click outside dropdown menu
  useEffect(() =>{
    const closeDropdown = e => {
      if(e.composedPath()[0] !== btnRef.current && e.target.id !== 'create-task-dropdown' && e.target.name !== 'group'){
        setDropdownActive(prevDrop => false);
      }
    }
    document.body.addEventListener('click', closeDropdown);
    return () => document.body.removeEventListener('click', closeDropdown);
  }, []);
  
  if( backendLoading || userLoading) return <p>Loading...</p>
  if(backendError) return <p>An Error occurred</p>
  const backendTasks = backendData.tasks;
  const backendGroups = backendData.groups;



  // Changes the group selection in the sidebar on click.
  function handleGroupSelection(event) {
    setGroupSelection(event.target.id)
  };

  // handles input changes except group
  function handleInputChange(event){
    const{name, value} = event.target;
    setInput(prevInput => ({...prevInput, [name]: value}))
  };

  // switches dropdown to active on click
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
    for(let i = 0; i < backendGroups.length; i++){
      if(backendGroups[i].title.toUpperCase() === (dropdownSearch.toUpperCase())){
        noMatches = false;
      }
    }
    //if the entered group name is new, add the new group to groupData, else choose existing
    if(noMatches){
      let newGroupId = nanoid();  
      mutateAddGroup({group_id: newGroupId, title: dropdownSearch, activeSidebar: false, selected: true});
      setSelected(newGroupId)
      setInput(prevInput => ({...prevInput, group_id: newGroupId, group_title: value}))
    } else{
      const currGroup = backendGroups.filter(group => group.title == value)[0]
      setSelected(currGroup.group_id);
      setInput(prevInput => ({...prevInput, group_id: currGroup.group_id, group_title: currGroup.title}))
    }
    setDropdownActive(prevDropdownActive => !prevDropdownActive)
  };

  //updates search bar state
  function dropdownFilter(event) {
    setDropdownSearch(event.target.value)
  };

  // makes options clickable in dropdown and selects them to show
  function dropdownSelected(event){
    const currGroupId = event.target.id    
    backendGroups.forEach(group => {
      if(group.group_id === currGroupId) {
        setInput({...input, group_title: group.title, group_id: group.group_id})
        setSelected(group.group_id)
      }
    })
  };

  function updateGroupAfterDelete(){
    setGroupSelection('default');
    setSelected('');
  }

  // adds the 'input' state into the currently selected task in 'taskData' state.
  function addTask(){
    if (input.title == '') {
      alert('You must enter a task description.')
    } else if ((input.start_time != '' || input.end_time != '') && input.date == ''){
      alert('You may not enter a start or end time without entering a date.')
    } else{
      mutateAddTask({...input, task_id: nanoid(), archived: false})
    }
  };

  return (
    <div className ="App" id={`${theme}`}>
      <Navbar user={backendData?.name} />
      <div className="vertical-sidebar">
        <Sidebar 
          groupData = {backendGroups}
          taskData = {backendTasks}
          updateGroupAfterDelete = {updateGroupAfterDelete}
          handleGroupSelection = {handleGroupSelection}
          groupSelection = {groupSelection}
        />
      </div>
      <main>
        <div className = "task-section">
          <CreateTask 
            groupData = {backendGroups} 
            input = {input}
            handleInputChange = {handleInputChange}
            addTask = {addTask}
            btnRef = {btnRef}
            dropdown = {dropdown} 
            dropdownActive = {dropdownActive} 
            dropdownEnter = {dropdownEnter}
            dropdownFilter = {dropdownFilter} 
            dropdownSearch = {dropdownSearch} 
            dropdownSelected = {dropdownSelected}
            selected = {selected}
          />
          <div className="horizontal-sidebar">
            <Sidebar 
              groupData = {backendGroups}
              taskData = {backendTasks}
              updateGroupAfterDelete = {updateGroupAfterDelete}
              handleGroupSelection = {handleGroupSelection}
              groupSelection = {groupSelection}
            />
          </div>
          { newTaskMessage.state && <Alert className="alert" variant="filled" severity="success">{newTaskMessage.msg}</Alert>}
          <GroupedTask 
            groupData = {backendGroups}
            taskData = {backendTasks}
            groupSelection = {groupSelection}
          />
        </div>
      </main>
    </div>
  )
};