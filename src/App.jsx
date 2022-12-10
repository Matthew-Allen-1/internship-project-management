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

export default function App() {
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [input, setInput] = useState(defaultInputState);
  const [groupData, setGroupData] = useState([
    {
      id: 0, 
      title: "Group", 
      tasks: [{title:"", group:"", startTime:"", endTime:"", date: ""}], 
      selected: true
    }
  ]);//stores all task data. I don't think this will work in the long run. 
    //probably need form tag around all the data in CreateTask jsx

    const btnRef = useRef();

// switches dropdown to active on click
  function dropdown(){
    setDropdownSearch("");
    setDropdownActive(prevDrop => !prevDrop);
  };

// adds group to list if enter key is pressed and checks repeats
  function dropdownEnter(event){
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
    }

    setDropdownActive(prevDrop => !prevDrop);
  };

//updates search bar state
  function dropdownFilter(event) {
    setDropdownSearch(event.target.value);
  };

  // handles click outside dropdown menu
  useEffect(() =>{

    const closeDropdown = e => {
      if(e.path[0] !== btnRef.current && e.target.name !== 'group'){
        setDropdownActive(prevDrop => false);
      }
    }

    document.body.addEventListener('click', closeDropdown);

    return () => document.body.removeEventListener('click', closeDropdown);
  }, [])

  function groupSelected(groupTitle){
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
    const{name, value} = event.target;
    setInput(prevValues => ({
      ...prevValues,
      [name]: value
    }))
  }

// This function needs adds the 'input' state into the 
// correct group in 'groupData' state.
  function addTask(){
    
  }
  
  return (
    <div className = "App">
      <Navbar />
      <main>
        <Sidebar number = {5} />
        <div className="task-section">
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
          <GroupedTask data={groupData} />
        </div>
      </main>
      
    </div>
  )
}