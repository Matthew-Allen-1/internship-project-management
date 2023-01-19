// Libraries
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import { UserProvider } from './context/UserContext'

// App component
import App from './App'

// Styling
import './index.css'

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client = {queryClient}>
    <UserProvider>
        <App />
    </UserProvider>
  </QueryClientProvider>
)
