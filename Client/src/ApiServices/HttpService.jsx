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

export const formPost = async (url, body, headers) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${getJwt()}`,
        ...headers 
      },
      // credentials: 'include',
      body: body
    });

    return res.json();
  } catch (err) {
    return ({auth: false})
  }
}

export const put = async (url, body, headers) => {
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getJwt()}`,
        ...headers 
      },
      body: JSON.stringify(body)
    });

    return res.json();
  } catch (err) {
    return ({err})
  }
}

export const formPut = async (url, body, headers) => {
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${getJwt()}`,
        ...headers 
      },
      body: body,
    });

    return res.json();
  } catch (err) {
    return ({err})
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