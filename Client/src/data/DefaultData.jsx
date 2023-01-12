export let defaultInputState = {
  title: "",
  groupTitle: "",
  groupId: 0,
  startTime: "",
  endTime: "",
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
  dropdownActive: false
}