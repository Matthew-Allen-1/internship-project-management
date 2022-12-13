import { useState, useEffect, useRef} from 'react'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import CreateTask from './Components/CreateTask'
import GroupedTask from './Components/GroupedTask'
import './index.css'

let defaultInputState = {
  title: "",
  group: "",
  startTime: "",
  endTime: "",
  date: ""
}

let defaultGroupObject = {
  id: 0, 
  title: "Group", 
  tasks: [], 
  selected: true
}

export default function App() {
  const btnRef = useRef();
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [input, setInput] = useState(defaultInputState);
  const [groupData, setGroupData] = useState([defaultGroupObject]);//stores all task data. I don't think this will work in the long run. 
    //probably need form tag around all the data in CreateTask jsx

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
    let id = groupData.length; // will need to add nanoid to deal with id
    for(let i = 0; i < groupData.length; i++){
      if(groupData[i].title.toUpperCase() === dropdownSearch.toUpperCase()){
        noMatches = false;
      }
    }

    if(noMatches){
      setInput(prevValues => ({
        ...prevValues,
        [name]: value
      }))
      setGroupData(prevData => prevData.map(group => ({...group, selected: false})))
      setGroupData(prevData => [...prevData, {id: id, title: dropdownSearch, tasks: [], selected: true}])
      console.log('Group Data After Drop Down Enter: ', groupData)
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
      if(e.path[0] !== btnRef.current && e.target.name !== 'group'){
        setDropdownActive(prevDrop => false);
      }
    }

    document.body.addEventListener('click', closeDropdown);

    return () => document.body.removeEventListener('click', closeDropdown);
  }, [])

  // makes options clickable in dropdown and Selects them to show
    function groupSelected(groupTitle){
      // console.log("groupSelected function called");
      setGroupData(prevData => prevData.map(group => {
        if(group.title.toUpperCase() === groupTitle.toUpperCase()){
          return {...group, selected: true}
        } else{
          return {...group, selected: false}
        }
      }))
      setDropdownActive(prevDrop => !prevDrop);
    }

  // handles input changes except group
    function handleInputChange(event){
      // console.log("handleInputChange function called");
      const{name, value} = event.target;
      setInput(prevValues => ({
        ...prevValues,
        [name]: value
      }))
    }

  // adds the 'input' state into the currently selected group in 'groupData' state.
    function addTask(){
      console.log("addTask function called");
      if(input.title == '') {
        alert('You must enter a task description.')
      }
      else {
        setGroupData(prevGroupData => prevGroupData.map(group => {
          if (!group.selected) {return group}
          else {
            const taskList = [...group.tasks, input]
            return ({...group, tasks: taskList})
          }
        }))
        console.log('Group Data After Add Task: ', groupData)
      }
    }

  
  return (
    <div className = "App">
      <Navbar />
      <main>
        <Sidebar 
          number = {5} 
          groupData = {groupData}
        />
        <div className="task-section">
          {/* <h1>Create Task Component</h1> */}
          <CreateTask 
            dropdown={dropdown} 
            dropdownActive={dropdownActive} 
            filter={dropdownFilter} 
            search={dropdownSearch} 
            groupData={groupData} 
            enter={dropdownEnter}
            handleChange={handleInputChange}
            input={input}
            addTask={addTask}
            groupSelected={groupSelected}
            btnRef={btnRef}
          />
          <GroupedTask groupData={groupData} />
        </div>
      </main>
      
    </div>
  )
}