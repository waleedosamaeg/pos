import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"

import Router from  "./router/appRouter.jsx"

import LanguageSwitcher from "@comp/languageSwitcher.jsx";

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
            {/* <LanguageSwitcher/> */}
            <App />
  </BrowserRouter>

)
