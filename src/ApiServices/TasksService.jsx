import { API_URL } from '../environment/environment.dev';
import { get, post } from './HttpService'


export const fetchTasks = async () => {
  try {
    return get(`${API_URL}/tasks`);
  } catch (err) {
    return { data: [], error: err }
  }
}


export const addTask = async (newTask) => {
  return post(`${API_URL}/add-task`, newTask);
}
