// Libraries
import React, { useState } from 'react'
import {nanoid} from 'nanoid'
import { useQuery, useMutation } from 'react-query'

// Api Services
import { fetchTasks } from '../../ApiServices/TasksService'

// Components
import Task from '../Task/Task'
import OptionsMenu from '../OptionsMenu'

//Styling
import './GroupedTask.css'


export default function GroupedTask(props){

  const { groupData, setGroupData, taskData, setTaskData, groupSelection, handleInputChange, 
    dropdown, dropdownEnter, dropdownFilter, dropdownSelected, 
    taskDropdownActive, setTaskDropdownActive, taskDropdownSearch, setTaskDropdownSearch, deleteTaskById} = props;

  const [selectAll, setSelectAll] = useState(false);

  const { data, isLoading, isError } = useQuery('tasks', fetchTasks);
  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>An Error occurred</p>

  const defaultTaskData = {
    title: 'Task that was added',
    groupTitle: 'Group that was chosen',
    groupId: 0,
    startTime: '12:00',
    endTime: '12:00',
    date: '1/1/00'
  }

  //converts date object to a displayable date string
  function convertDateToString(date) {
    const newDate = new Date(date);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][newDate.getDay()]
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][newDate.getMonth()];
    const day = newDate.getDate()

    var daySuffix = ''
    switch(parseInt(day) % 10) {
      case 1: daySuffix = 'st'; break;
      case 2: daySuffix = 'nd'; break;
      case 3: daySuffix = 'rd'; break;
      default: daySuffix = 'th'; break;
    }
    switch(day){
      case 11: daySuffix = 'th'
      case 12: daySuffix = 'th'
      case 13: daySuffix = 'th'
    }    
    
    return (<span>
              {weekday + ', ' + month + ' ' + day}
              <sup>{daySuffix}</sup>
              {' ' + newDate.getFullYear()}
            </span>)
  }

  function calcElapsedTime(task) {
    if (!task.startTime || !task.endTime ) {return 0}
    else {
      const endTimeInMinutes = parseInt(task.endTime.slice(0, 2)) * 60 + parseInt(task.endTime.slice(3, 5))
      const startTimeInMinutes = parseInt(task.startTime.slice(0, 2)) * 60 + parseInt(task.startTime.slice(3, 5))
      const duration = endTimeInMinutes - startTimeInMinutes
      return duration < 0 ? (duration + Math.ceil(Math.abs(duration) / 1440) * 1440) : duration
    }
  }

  function convertElapsedToText(duration) {
    const hoursElapsed = Math.floor(duration / 60)
    const minutesElapsed = ''.concat((duration % 60) < 10 ? '0' : '', (duration % 60).toString())
    return (hoursElapsed.toString() + ":" + minutesElapsed.toString())
  }

//Filter task list according to the group selected in the sidebar.
  const filteredTasks = taskData.filter((task, index) => {
    const indexOfGroupSelection = groupData.map(group => group.id).indexOf(groupSelection)
    if (groupSelection == 0 || index == 0) {return true}
    else {return groupData[indexOfGroupSelection].taskIds.indexOf(task.id) >= 0}
 })

  //Sort filtered task list in ascending order by date.
  const sortedTasks = filteredTasks.sort(function(a,b){
    if (new Date(a.date) - new Date(b.date) == 0) {
      if (a.startTime < b.startTime) {return -1}
      else return 1
    }
    else {return new Date(a.date) - new Date(b.date)};
  });

  //Create an array of dates for which displayed tasks are assigned (if any).
  const dateList = sortedTasks.filter((task, index) => {
    if (index > 0 && task.date) {return(task.date != sortedTasks[index - 1].date)}
    else {return false}
  })
  .map(task => task.date)

  //Create an array of task element arrays with one array of tasks for each date in dateList and one additional array for unscheduled tasks.
  const taskElementArrays = dateList.map((date, index) => [])
  taskElementArrays.push([])

  function TaskComponent (task) {
    return(
      <Task 
        key = {task.id} 
        task = {task} 
        elapsedTime = {convertElapsedToText(calcElapsedTime(task))}
        groupData = {groupData}
        handleInputChange = {handleInputChange}
        dropdown = {dropdown}
        dropdownFilter = {dropdownFilter}
        dropdownEnter = {dropdownEnter}
        dropdownSelected={dropdownSelected}
        taskDropdownSearch={taskDropdownSearch}
        deleteTaskById={deleteTaskById}
        selectAll={selectAll}
      />
    )
  }

  //Push the tasks corresponding to each date in dateList to the corresponding array element of taskElements
  sortedTasks.forEach((task, index) => {
    if(index > 0 && dateList.indexOf(task.date) >= 0 ) {taskElementArrays[dateList.indexOf(task.date)].push(
      TaskComponent(task)
    )}
    else if (index > 0) {taskElementArrays[taskElementArrays.length - 1].push(
      TaskComponent(task)
    )}
  })
    // console.log('taskElementArrays', taskElementArrays)

      //Create an array of total times corresponding to the dates in dateList.
  const timeTotals = taskElementArrays.map((taskArray, index) => {
    // console.log('taskArray', taskArray)
    return taskArray.reduce((runningTotal, currentTask) => {
      // console.log('runningTotal', runningTotal)
      // console.log('currentTask', currentTask)
      // console.log('elapsed current', calcElapsedTime(currentTask))
      return (runningTotal + calcElapsedTime(currentTask.props.task))
    }, 0)
  })

  // console.log('timeTotals', timeTotals)

  function handleSelect() {
    console.log(selectAll)
    setSelectAll(prevSelect => !prevSelect);
  }

  //Create an array of divs corresponding to the dates in dateList
  const dateTaskElements = taskElementArrays.filter(taskElementArray => taskElementArray.length != 0)
  .map((taskElementArray, index) => {

    //Convert the date to a string to display
    var dateStr = index <= dateList.length - 1 ? convertDateToString(dateList[index]) : <span>Unscheduled Tasks</span>
    // var timeStr = 

    return(
      <div key = {index}>
        <div className = "task-header">
          {selectAll && <input type="checkbox"/>}
          <p className = "left" >{dateStr}</p>
          <div className = "right">
            <p>{timeTotals[index] > 0 ? 'Total Time: ' + convertElapsedToText(timeTotals[index]) : ''}</p>
            <img onClick={handleSelect} src = "https://app.clockify.me/assets/ui-icons/bulk-edit.svg" alt = "" />
          </div>
        </div>
        {taskElementArray}
      </div>
    )
  })

  return(
    <div>
      {dateTaskElements}
    </div>
  )
}