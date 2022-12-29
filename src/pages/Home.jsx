import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import CreateTask from '../Components/CreateTask'
import GroupedTask from '../Components/GroupedTask'

export default function Home(props){
  const {dropdown, dropdownActive, dropdownFilter, dropdownSearch, groupData, dropdownEnter, 
  handleInputChange, input, addTask, groupSelected, btnRef, taskData} = props;

  return (
    <div className = "App">
    <Navbar />
    <main>
      <Sidebar 
        groupData = {groupData}
        handleGroupSelection = {props.handleGroupSelection}
        groupSelection = {props.groupSelection}
        groupSidebarStyles = {props.groupSidebarStyles}
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
        <GroupedTask 
          taskData={taskData}
          groupData={groupData}
          groupSelection = {props.groupSelection}
        />
      </div>
    </main>
    
  </div>
  )
}