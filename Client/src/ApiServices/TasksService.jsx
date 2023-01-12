import { API_URL } from '../environment/environment.dev';
import { get, post } from './HttpService'


export const fetchTasks = async () => {
  try {
    return get(`${API_URL}/tasks`);
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
