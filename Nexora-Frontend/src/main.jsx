import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import UserContextProvider from './context/user/UserContextProvider.jsx'
import {BrowserRouter} from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserContextProvider>
    <App />
  </UserContextProvider>
  </BrowserRouter>,
)
