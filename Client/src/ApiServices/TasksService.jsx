import { API_URL } from '../environment/environment.dev';
import { get, post, remove } from './HttpService'


export const fetchTasks = async () => {
  try {
    return get(`${API_URL}/tasks`);
  } catch (err) {
    return { data: [], error: err }
  }
}

export const fetchArchivedTasks = async () => {
  try {
    return get(`${API_URL}/archived-tasks`);
  } catch (err) {
    return { data: [], error: err }
  }
}


export const addTaskRequest = async (newTask) => {
  try{
    return post(`${API_URL}/add-task`, newTask);
  } catch(err){
    return { data: [], error: err }
  }
}

export const addGroupRequest = async (newGroup) => {
  try{
    return post(`${API_URL}/add-group`, newGroup);
  } catch(err){
    return { data: [], error: err } 
  }
}

export const updateTaskRequest = async (newGroup) => {
  try{
    return post(`${API_URL}/update-task`, newGroup);
  } catch(err){
    return { data: [], error: err }
  }
}

export const deleteTaskRequest = async (id) => {
  try{
    return remove(`${API_URL}/delete-task/${id}`);
  } catch(err){
    return { data: [], error: err } 
  }
}

export const deleteGroupRequest = async (id) => {
  try{
    return remove(`${API_URL}/delete-group/${id}`)
  }catch(err){
    return { data: [], error: err }
  }
}
