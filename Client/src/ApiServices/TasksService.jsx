import { API_URL } from '../environment/environment.dev';
import { get, post, put, formPut, remove } from './HttpService'

export const fetchUser = async () => {
  try {
    return get(`${API_URL}/user`);
  } catch (err) {
    return { data: [], error: err }
  }
}

export const fetchTasks = async () => {
  try {
    return get(`${API_URL}/task`);
  } catch (err) {
    return { data: [], error: err }
  }
}

export const addTaskRequest = async (newTask) => {
  try{
    return post(`${API_URL}/task`, newTask);
  } catch(err){
    return { data: [], error: err }
  }
}

export const updateTaskRequest = async (updatedTask) => {
  try{
    return put(`${API_URL}/task`, updatedTask);
  } catch(err){
    return { data: [], error: err }
  }
}

export const deleteTaskRequest = async (id) => {
  try{
    return remove(`${API_URL}/task/${id}`);
  } catch(err){
    return { data: [], error: err } 
  }
}

export const fetchArchivedTasks = async () => {
  try {
    return get(`${API_URL}/task/archive`);
  } catch (err) {
    return { data: [], error: err }
  }
}

export const addGroupRequest = async (newGroup) => {
  try{
    return post(`${API_URL}/group`, newGroup);
  } catch(err){
    return { data: [], error: err } 
  }
}

export const deleteGroupRequest = async (id) => {
  try{
    return remove(`${API_URL}/group/${id}`)
  }catch(err){
    return { data: [], error: err }
  }
}

export const updateAvatarRequest = async (newAvatar) => {
  try{
    return formPut(`${API_URL}/profile`, newAvatar);
  } catch(err){
    return { data: [], error: err }
  }
}
