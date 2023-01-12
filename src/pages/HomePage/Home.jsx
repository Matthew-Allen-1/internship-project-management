import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import CreateTask from '../Components/CreateTask'
import GroupedTask from '../Components/GroupedTask'

export default function Home(props){
  const {groupData, setGroupData, taskData, setTaskData, input, handleInputChange, addTask, groupSelection, handleGroupSelection, 
    groupSidebarStyles, btnRef, dropdown, dropdownActive, dropdownFilter, dropdownSearch,dropdownEnter, dropdownSelected, 
    taskDropdownActive, setTaskDropdownActive, taskDropdownSearch, setTaskDropdownSearch} = props;

  return (
    <div className = "App">
    <Navbar />
    <main>
      <Sidebar 
        groupData = {groupData}
        handleGroupSelection = {handleGroupSelection}
        groupSelection = {groupSelection}
        groupSidebarStyles = {groupSidebarStyles}
      />
      <div className = "task-section">
        <CreateTask 
          groupData = {groupData} 
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
        />
        <GroupedTask 
          groupData = {groupData}
          setGroupData = {setGroupData}
          taskData = {taskData}
          setTaskData = {setTaskData}

          groupSelection = {groupSelection}
          handleInputChange = {handleInputChange}

          dropdown = {dropdown}
          dropdownEnter = {dropdownEnter}
          dropdownFilter = {dropdownFilter}
          dropdownSelected = {dropdownSelected}

          taskDropdownSearch = {taskDropdownSearch}
          setTaskDropdownSearch = {setTaskDropdownSearch}
          taskDropdownActive = {taskDropdownActive}
          setTaskDropdownActive = {setTaskDropdownActive}
        />
      </div>
    </main>
  </div>
  )
}