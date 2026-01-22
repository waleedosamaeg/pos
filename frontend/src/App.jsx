import "@css/root.css"
import Login from "@comp/login.jsx"
import Register from "@comp/register.jsx"
import './i18next.js';
import LanguageSwitcher from "@comp/languageSwitcher.jsx";
import { AppProvider  , useAppContext} from "@context/appContext.jsx";
import Loader from "@comp/loader.jsx";



function AppContent() { 
    const {state ,dispatch} = useAppContext();

  return (
    <>
          {state.loading ? <Loader/> : null}
          <LanguageSwitcher/>
          {/* <Login /> */}
          <Register/>

    </>
  )
}

export default function App() { 

  return (
    <>   
    
     <AppProvider>
          <AppContent />
     </AppProvider>
    </>

  )
}