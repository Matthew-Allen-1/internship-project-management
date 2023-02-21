export let defaultInputState = {
  title: "",
  group_title: "",
  group_id: 0,
  start_time: "",
  end_time: "",
  date: ""
}

export let allTasksGroupState = {
  id: 0, 
  title: "Group", 
  taskIds: [], 
  selected: true,
  activeSidebar: true
}

export let unscheduledTasksGroupState = {
  id: 1, 
  title: "Unscheduled Tasks", 
  taskIds: ['444', '123'], 
  selected: false,
  activeSidebar: false
}

export let defaultTaskState = {
  ...defaultInputState,
  id: 0,
  archived: false
}