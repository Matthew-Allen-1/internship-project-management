import React from 'react'
import '../styling/GroupedTask.css'
import Task from './Task'

export default function GroupedTask(props){

  const defaultTaskData = {
    title: 'Task that was added',
    groupTitle: 'Group that was chosen',
    groupId: 0,
    startTime: '12:00',
    endTime: '12:00',
    date: '1/1/00'
  }


  //create an array of task elements corresponding to inputted tasks

  const taskElements = props.taskData.map(task => <Task task = {task} />)


  return(
    <div>
      {/* <h1>Grouped Task Component</h1> */}
      <div className="task-header">
        <p className="left" >Fri, Dec 2</p>
        <div className="right">
          <p>Total: 00:01:00</p>
          <img src="https://app.clockify.me/assets/ui-icons/bulk-edit.svg" alt="" />
        </div>
      </div>
      {/* <Task taskData = {defaultTaskData}/>
      <Task taskData = {defaultTaskData}/> */}
      {taskElements}
    </div>
  )
}