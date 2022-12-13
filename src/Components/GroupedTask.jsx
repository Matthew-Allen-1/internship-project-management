import React from 'react'
import '../styling/GroupedTask.css'
import Task from './Task'

export default function GroupedTask(props){

  const defaultTaskData = {
    title: 'Task that was added',
    group: 'Group that was chosen',
    startTime: '12:00',
    endTime: '12:00',
    date: '1/1/00'
  }

  // console.log('Props.data: ', props.groupData)

  //create an array of task elements corresponding to inputted tasks
  const taskElements = []
  props.groupData.forEach(group => {
    const newTaskElements = group.tasks.map(task => {
      return(<Task taskData = {task}/>)
    })
    taskElements.push(...newTaskElements)
  })

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