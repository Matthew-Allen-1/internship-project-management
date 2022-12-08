import { useState } from 'react'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import CreateTask from './Components/CreateTask'
import GroupedTask from './Components/GroupedTask'
import './index.css'

export default function App() {
  const [dropdownActive, setDropdownActive] = useState(false); //controls dropdown state
  const [dropdownSearch, setDropdownSearch] = useState(""); //stores search bar on dropdown value
  const [groupData, setGroupData] = useState([
    {
      id: 0, 
      title: "Group", 
      tasks: [{title:"", group:"", startTime:"", endTime:"", date: ""}], 
      selected: true
    }
  ]);//stores all task data. I don't think this will work in the long run. 
    //probably need form tag around all the data in CreateTask jsx

// switches dropdown to active on click
  function dropdown(){
    setDropdownSearch("");
    setDropdownActive(prevDrop => !prevDrop);
  };

// adds group to list if enter key is pressed and checks repeats
  function dropdownEnter(event){
    if(event.key !== "Enter") return;
    
    let noMatches = true;
    let id = groupData.length; // will need to add nanoid to deal with id
    for(let i = 0; i < groupData.length; i++){
      if(groupData[i].title.toUpperCase() === dropdownSearch.toUpperCase()){
        noMatches = false;
      }
    }

    if(noMatches){
      setGroupData(prevData => prevData.map(group => ({...group, selected: false})))
      setGroupData(prevData => [...prevData, {id: id, title: dropdownSearch, tasks: [], selected: true}])
    }

    setDropdownActive(prevDrop => !prevDrop);
  };

//updates search bar state
  function dropdownFilter(event) {
    setDropdownSearch(event.target.value);
  };
  
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
          />
          <GroupedTask data={groupData} />
        </div>
      </main>
      
    </div>
  )
}