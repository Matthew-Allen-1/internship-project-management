export let defaultInputState = {
  title: "",
  groupTitle: "",
  groupId: 0,
  startTime: "",
  endTime: "",
  date: ""
}

export let allPromptsGroupState = {
  id: 0, 
  title: "Group", 
  taskIds: [], 
  selected: true,
  activeSidebar: true
}

export let undatedPromptsGroupState = {
  id: 1, 
  title: "Undated Prompts", 
  taskIds: ['000', '123'], 
  selected: false,
  activeSidebar: false
}

export let defaultPromptState = {
  ...defaultInputState,
  id: 0,
  dropdownActive: false,
  response: ''
}