import React, { useState } from 'react'

// Components
import Task from '../Task/Task'
import { useMutationDeleteTask } from '../../hooks/useMutationHook';

//Styling
import './GroupedTask.css'


export default function GroupedTask(props){
  const { groupData, taskData, groupSelection } = props;
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const {mutate: mutateDeleteTask} = useMutationDeleteTask()

  //converts date object to a displayable date string
  function convertDateToString(date) {
    const newTime = date + "T00:00:00.000-08:00"
    const newDate = new Date(newTime);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][newDate.getDay()]
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][newDate.getMonth()];
    const day = newDate.getDate();

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
    if (!task.start_time || !task.end_time ) {return 0}
    else {
      const end_timeInMinutes = parseInt(task.end_time.slice(0, 2)) * 60 + parseInt(task.end_time.slice(3, 5))
      const start_timeInMinutes = parseInt(task.start_time.slice(0, 2)) * 60 + parseInt(task.start_time.slice(3, 5))
      const duration = end_timeInMinutes - start_timeInMinutes
      return duration < 0 ? (duration + Math.ceil(Math.abs(duration) / 1440) * 1440) : duration
    }
  }

  function convertElapsedToText(duration) {
    const hoursElapsed = Math.floor(duration / 60)
    const minutesElapsed = ''.concat((duration % 60) < 10 ? '0' : '', (duration % 60).toString())
    return (hoursElapsed.toString() + ":" + minutesElapsed.toString())
  }

  function handleSelect() {
    if(selectAll == true){
      setSelectedTasks([])
    }
    setSelectAll(prevSelect => !prevSelect);
  }
  function handleCheckbox(event){
    if(selectedTasks.includes(event.target.id)){
      console.log('twice')
      setSelectedTasks(prevSelected => {
        return prevSelected.filter(selected => selected !== event.target.id)
      })
    } else{
      setSelectedTasks(prevSelected => ([...prevSelected, event.target.id]))
    }
  }
  function handleCheckboxDelete(){
    setSelectAll(false);
    if(selectedTasks != []){
      selectedTasks.map(task_id => {
        mutateDeleteTask(task_id);
      })
    }
    setSelectedTasks([])
  }

  const filteredTasks = taskData.filter(task => {
    if(groupSelection === 'default'){
      return true
    } else if (groupSelection === 'unscheduled' && !task.date){
      return true
    } else if(groupSelection === task.group_id){
     return true
    } else{
      return false
    }
  })

  //Sort filtered task list in ascending order by date.
  const sortedTasks = filteredTasks.sort(function(a,b){
    if (new Date(a.date) - new Date(b.date) == 0) {
      if (a.start_time < b.start_time) {return -1}
      else return 1
    }
    else {return new Date(a.date) - new Date(b.date)};
  });

  //Create an array of dates for which displayed tasks are assigned (if any).
  const dateList = sortedTasks.filter((task, index) => {
    if (index == 0 && task.date) {return true}
    else if (task.date) {return(task.date != sortedTasks[index - 1].date)}
    else {return false}
  }).map(task => task.date)

  //Create an array of task element arrays with one array of tasks for each date in dateList and one additional array for unscheduled tasks.
  const taskElementArrays = dateList.map((date, index) => [])
  taskElementArrays.push([])

  function TaskComponent (task) {
    return(
      <Task 
        key = {task.task_id} 
        task = {task} 
        elapsedTime = {convertElapsedToText(calcElapsedTime(task))}
        groupData = {groupData}
        selectAll={selectAll}
        selectedTasks={selectedTasks}
        handleCheckbox={handleCheckbox}
      />
    )
  }

  //Push the tasks corresponding to each date in dateList to the corresponding array element of taskElements
  sortedTasks.forEach(task => {
    if(dateList.indexOf(task.date) >= 0 ) {taskElementArrays[dateList.indexOf(task.date)].push(
      TaskComponent(task)
    )}
    else {taskElementArrays[taskElementArrays.length - 1].push(
      TaskComponent(task)
    )}
  })

  //Create an array of total times corresponding to the dates in dateList.
  const timeTotals = taskElementArrays.map((taskArray, index) => {
    return taskArray.reduce((runningTotal, currentTask) => {
      return (runningTotal + calcElapsedTime(currentTask.props.task))
    }, 0)
  })

  //Create an array of divs corresponding to the dates in dateList
  const dateTaskElements = taskElementArrays.filter(taskElementArray => taskElementArray.length != 0)
  .map((taskElementArray, index) => {

    //Convert the date to a string to display
    var dateStr = index <= dateList.length - 1 ? convertDateToString(dateList[index]) : <span>Unscheduled Tasks</span>
    // var timeStr = 

    return(
      <div key = {index} className="grouped-tasks-container">
        <div className ="task-header">
          <p className = "left" >{dateStr}</p>
          <div className = "right">
            <p>{timeTotals[index] > 0 ? 'Total Duration: ' + convertElapsedToText(timeTotals[index]) : ''}</p>
            <img onClick={() => handleSelect()} src = "https://app.clockify.me/assets/ui-icons/bulk-edit.svg" alt = "" />
          </div>
        </div>
        {taskElementArray}
      </div>
    )
  })

  return(
    <div className="all-groups-tasks-container">
      {selectAll && <a className="delete-all-link" href="#" onClick={() => handleCheckboxDelete()}>Delete</a>}
      {dateTaskElements}
    </div>
  )
}