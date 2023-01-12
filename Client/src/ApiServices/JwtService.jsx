const jwtProp = 'chtjwt';

export const setJwt = (token) => {
  localStorage.setItem(jwtProp, token);
}

export const getJwt = () => {
  const jwt =  localStorage.getItem(jwtProp);
  return jwt;
}

export const clearJwt = () => {
  localStorage.removeItem(jwtProp)
}
