import "@css/root.css"
import './i18next.js';
import { AppProvider  , useAppContext} from "@context/appContext.jsx";
import Loader from "@comp/loader.jsx";
import Router from  "./router/appRouter.jsx"
import 'rsuite/dist/rsuite.css';
import { useEffect } from "react";
import { Message, useToaster, ButtonToolbar, SelectPicker, Button } from 'rsuite';
import { CustomProvider } from 'rsuite';
import RequestHandler from "@util/requestHandler.js";
import Modal from "@comp/modal.jsx"
import Authenticate from "@util/Authentication.js";
import { useNavigate } from "react-router-dom";

function AppContent() { 
    const {state ,dispatch} = useAppContext();
    const navigator = useNavigate()
 
    useEffect(()=>{

  
      const Auth = async ()=>{ 
        const au =  new Authenticate()
        dispatch({type: "loading"})
        const checkToken = await au.checkToken()
        dispatch({type:"stop.loading"})
        // redirect to the login if token is invalid
        if (!checkToken.state) {
          navigator("/login")
        }
        return dispatch({type: "user.set-user" , payload : checkToken.data})
         localStorage.setItem("user-data" , JSON.stringify(checkToken.data))
        
        // return navigator("/dashboard")

      }
      Auth()

      // check the JWT token
    },[])

  return (
    <>
        {state.loading ? <Loader/> : null}
        {state.modal ? <Modal/> : null}
        <Router/>
    </>
  )
}

export default function App() { 

  return (
    <>   
      <CustomProvider>
          <AppProvider>
                <AppContent />
            </AppProvider>
      </CustomProvider>
      

    </>

  )
}