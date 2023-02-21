import React, { createContext, useState } from 'react';

const UserContext = createContext(null);
let userTheme;
if(localStorage.getItem('taskManagerTheme') == null){
  userTheme = 'light';
} else{
  userTheme = JSON.parse(localStorage.getItem('taskManagerTheme')).theme;
}

function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(userTheme);
  const [newTaskMessage, setNewTaskMessage] = useState({state: false, msg: ''})

  function loginUser(payload) {
    setCurrentUser({ ...payload })
    localStorage.setItem('taskManagerTheme', JSON.stringify({theme: theme }))
  }

  function updateNewTaskMessage(boolean, msg){
    setNewTaskMessage({state: boolean, msg: msg})
  }

  function toggleTheme() {
    if(theme == 'dark'){
      setTheme('light')
      localStorage.setItem('taskManagerTheme', JSON.stringify({theme: 'light' }))
    } else if(theme == 'light'){
      setTheme('dark')
      localStorage.setItem('taskManagerTheme', JSON.stringify({theme: 'dark' }))
    }
  }


  return (
    <UserContext.Provider value={{currentUser, newTaskMessage, theme, loginUser, updateNewTaskMessage, toggleTheme}}>
      {children}
    </UserContext.Provider>
  )
}

export{ UserProvider, UserContext }