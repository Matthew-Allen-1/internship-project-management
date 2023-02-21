import { getJwt } from '../ApiServices/JwtService';

export const get = async (url, headers) => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${getJwt()}`,
        ...headers 
      },
    });

    return res.json();
  } catch (err) {
    return({auth: false})
  }
}

export const post = async (url, body, headers) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getJwt()}`,
        ...headers 
      },
      // credentials: 'include',
      body: JSON.stringify(body)
    });

    return res.json();
  } catch (err) {
    return ({auth: false})
  }
}

export const put = async (url, headers) => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { ...headers }
    });

    return res.json();
  } catch (err) {
    
  }
}

export const remove = async (url, headers) => {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${getJwt()}`,
        ...headers 
      },
    });

    return res.json();
  } catch (err) {
    
  }
}