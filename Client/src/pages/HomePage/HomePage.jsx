// Libraries
import {nanoid} from 'nanoid'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { UserContext } from '../../context/UserContext'

// Components
import Navbar from '../../Components/Navbar/Navbar'
import Sidebar from '../../Components/Sidebar/Sidebar'
import CreateTask from '../../Components/CreateTask/CreateTask'
import GroupedTask from '../../Components/GroupedTask/GroupedTask'
import Alert from '@mui/material/Alert'

// other Data
import {HardCodedTaskData} from '../../Components/HardCodedTaskData'
import {HardCodedGroupData} from '../../Components/HardCodedGroupData'
import { defaultInputState, allTasksGroupState, unscheduledTasksGroupState, defaultTaskState} from '../../data/DefaultData'

// Requests functions
import { fetchTasks,  addTaskRequest, addGroupRequest } from '../../ApiServices/TasksService'

// Styling
import './HomePage.css'


export default function Home(){
  const { currentUser }= useContext(UserContext);
  const queryClient = useQueryClient();
  const { data: backendData , isLoading: backendLoading, isError: backendError , refetch} = useQuery(
    'tasks', 
    fetchTasks,
    {
      refetchOnWindowFocus: false,
    }
  );

  const btnRef = useRef();
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [input, setInput] = useState(defaultInputState);

  //The following declarations include some pre-loaded data.
  const [groupData, setGroupData] = useState([allTasksGroupState, unscheduledTasksGroupState, ...HardCodedGroupData]);  //stores all group data. 
  const [taskData, setTaskData] = useState([defaultTaskState, ...HardCodedTaskData]); //stores all task data.  I don't think this will work in the long run. 
  //probably need form tag around all the data in CreateTask jsx

  const [groupSelection, setGroupSelection] = useState('default')
  const [taskDropdownSearch, setTaskDropdownSearch] = useState('')
  const [taskDropdownActive, setTaskDropdownActive] = useState(false)
  const [newTaskMessage, setNewTaskMessage] = useState(false)
  const [selected, setSelected] = useState('')

  // handles click outside dropdown menu
  useEffect(() =>{
    const closeDropdown = e => {
      if(e.composedPath()[0] !== btnRef.current && e.target.id !== 'create-task-dropdown' && e.target.name !== 'group'){
        setDropdownActive(prevDrop => false);
      }
    }
    document.body.addEventListener('click', closeDropdown);
    return () => document.body.removeEventListener('click', closeDropdown);
  }, [])

  const { mutate: mutateAddTask } = useMutation(
    (newTask) => addTaskRequest(newTask),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks'])
        setNewTaskMessage(true)
        setTimeout(() => {
          setNewTaskMessage(false)
        }, 5000)
      }
    }
  );
  const { mutate: mutateAddGroup } = useMutation(
    (newGroup) => addGroupRequest(newGroup),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['tasks']);
        setInput(prevInput => ({...prevInput, groupTitle: dropdownSearch}))
        setDropdownActive(false);
        setDropdownSearch('');
      }
    }
  );

  if( backendLoading ) return <p>Loading...</p>
  if(backendError) return <p>An Error occurred</p>
  const backendTasks = backendData.tasks;
  const backendGroups = backendData.groups;

  // Changes the group selection in the sidebar on click.
  function handleGroupSelection(event) {
    //Set the newly selected group in the sidebar
    setGroupSelection(event.target.id)
  }

  // handles input changes except group
  function handleInputChange(event, createTaskBoolean){
    const{name, value} = event.target;

    //handles input changes on the create task
    if(createTaskBoolean) {
      setInput(prevInput => ({...prevInput, [name]: value}))
    }

    //handles input changes on a task from the task list
    else {
      setTaskData(prevTaskData => prevTaskData.map(prevTask => {
        console.log('event.target.id', event.target.id)
        if (event.target.id == name + '#' + prevTask.id) {
          console.log(`Updating Task#${prevTask.id} ${name} to ${value}`)
          return ({...prevTask, [name]: value})
        }
        else {return prevTask}
      }))
    }
  } 

  // switches dropdown to active on click
  function dropdown(event, createTaskBoolean) {

    // handles a click on the create task dropdown
    if (createTaskBoolean) {
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
  function dropdownEnter(event, createTaskBoolean){
    
    const {name, value} = event.target

    //check to see if user pressed "Enter"
    if(event.key !== "Enter") {return}
    
    //check to see if the entered group name is new
    let noMatches = true;
    for(let i = 0; i < backendGroups.length; i++){
      if(backendGroups[i].title.toUpperCase() === (createTaskBoolean ? dropdownSearch.toUpperCase() : taskDropdownSearch.toUpperCase()) ){
        noMatches = false;
      }
    }

    //if the entered group name is new, add the new group to groupData
    if(noMatches){
      let newGroupId = nanoid(); 
      
      //handles the addition of a new group on the create task dropdown
      if (createTaskBoolean) {
        mutateAddGroup({id: newGroupId, title: dropdownSearch, activeSidebar: false, selected: true});
        setSelected(newGroupId)
        setInput(prevInput => ({...prevInput, groupId: newGroupId, groupTitle: value}))
        createTaskBoolean ? setDropdownActive(prevDropdownActive => !prevDropdownActive) : setTaskDropdownActive(prevTaskDropdownActive => !prevTaskDropdownActive)
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

    //else if the entered group name matches an existing group, select the entered group name
    else {
      // gets the current group id from the event.target.id
      const currGroup = backendGroups.filter(group => group.title == value)[0]
      const currGroupId = currGroup.id

      // handles a selection in the create task dropdown
      if (createTaskBoolean) {
        setGroupData(prevGroupData => prevGroupData.map(group => {
          if(group.title.toUpperCase() === currGroup.title.toUpperCase()){
            setInput({...input, groupTitle: group.title, groupId: group.id})
            return {...group, selected: true}
          } else {
            return {...group, selected: false}
          }
        }))
        createTaskBoolean ? setDropdownActive(prevDropdownActive => !prevDropdownActive) : setTaskDropdownActive(prevTaskDropdownActive => !prevTaskDropdownActive)
      }

      // handles a selection in a task list dropdown 
      else {
       // slices off "drop-down-enter#" from the event.target.id to get the current task id
        const currTaskId = event.target.id.slice(15)
        const currTask = taskData.filter(task => task.id == currTaskId)[0]

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
    }
  };

  //updates search bar state
  function dropdownFilter(event, createTaskBoolean) {
    //updates search bar on the create task dropdown
    if (createTaskBoolean) {setDropdownSearch(event.target.value)}
    //updates search bar on a task list dropdown
    else {setTaskDropdownSearch(event.target.value)}
  }

  // makes options clickable in dropdown and selects them to show
  function dropdownSelected(event, createTaskBoolean){
    
    // gets the current group id from the event.target.id
    const currGroupId = event.target.id
    console.log('currGroupId', currGroupId)

    // handles a selection in the create task dropdown
    if (createTaskBoolean) {
      if (currGroupId === "create-dropdown-input") {
        // setInput({...input, groupTitle: 'Group', groupId: "default"})
        // setSelected("default")
        // console.log('Selected Group: ', "default")
      }
      else {
        backendGroups.forEach(group => {
          if(group.group_id === currGroupId) {
            setInput({...input, groupTitle: group.title, groupId: group.group_id})
            setSelected(group.group_id)
            console.log('Selected Group: ', group.title)
          }
        })
      }
    }

    // handles a selection in a task list dropdown 
    else {
      // slices off "group-list#" from the event.target.id to get the current task id
      const currTaskId = event.target.className.slice(11)
      const currTask = taskData.filter(task => task.id == currTaskId)[0]

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
    // createTaskBoolean ? setDropdownActive(prevDrop => !prevDrop) : setTaskDropdownActive(prevTaskDropDownActive => !prevTaskDropDownActive)
  };

  // adds the 'input' state into the currently selected task in 'taskData' state.
  function addTask(){
    if (input.title == '') {alert('You must enter a task description.')}
    else if ((input.startTime != '' || input.endTime != '') && input.date == '') {
      alert('You may not enter a start or end time without entering a date.')
    }
    else {
      mutateAddTask({...input, id: nanoid(), dropdownActive: false})
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
    console.log(input);
  };

  return (
    <div className = "App">
      <Navbar user={backendData?.name} />
      <Sidebar 
        groupData = {backendGroups}
        handleGroupSelection = {handleGroupSelection}
        groupSelection = {groupSelection}
      />
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
          { newTaskMessage && <Alert className="alert" variant="filled" severity="success">Task Saved</Alert>}
          <GroupedTask 
            groupData = {backendGroups}
            setGroupData = {setGroupData}
            taskData = {backendTasks}
            setTaskData = {setTaskData}

            groupSelection = {groupSelection}
            handleInputChange = {handleInputChange}

            dropdown = {dropdown}
            dropdownEnter = {dropdownEnter}
            dropdownFilter = {dropdownFilter}
            dropdownSelected = {dropdownSelected}

            taskDropdownSearch = {taskDropdownSearch}
            setTaskDropdownSearch = {setTaskDropdownSearch}

            newTaskMessage = {newTaskMessage}
          />
        </div>
      </main>
    </div>
  )
};