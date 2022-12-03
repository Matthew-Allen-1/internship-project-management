import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Groups from './Components/Groups'
import Tasks from './Components/Tasks'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className = "App">
      <Navbar />

      <main>
        <Groups 
          number = {5}
        />
        <Tasks 
          number = {5}
        />
          
      </main>
      
    </div>
  )
}

export default App
