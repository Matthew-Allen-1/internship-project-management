import { API_URL } from '../environment/environment.dev';
import { get, post } from './HttpService';


export const registerUser = async (user)=> {
  try {
    return post(`${API_URL}/register`, user);
    // return res.json();
  } catch (err) {
    return { data: [], error: err }
  }
}

export const authenticateUser =  async (user)=> {
  // const res = await fetch(`${API_URL}/authenticate`);
  return post(`${API_URL}/authenticate`, user);
    // return res.json();
}
