import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [testTask, setTestTask] = useState([]);
  const [testGroup, setTestGroup] = useState([]);

  function loginUser(payload) {
    setCurrentUser({ ...payload })
  }

  function updateFrontend(tasks, groups) {
    setTaskDataB()
  }

  function signOut(){

  }

  return (
    <UserContext.Provider value={{currentUser, loginUser, signOut}}>
      {children}
    </UserContext.Provider>
  )
}

export{ UserProvider, UserContext }