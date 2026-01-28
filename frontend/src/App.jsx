  import "@css/root.css"
  import './i18next.js';
  import { AppProvider  , useAppContext} from "@context/appContext.jsx";
  import { UiProvider , useUiContext } from "@context/uiContext.jsx";
  import { UserProvider , useUserContext } from "@context/userContext.jsx";

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
  // import  { TabProvider } from "@context/tabContext.jsx";

  function AppContent() { 
      const {state:uiState ,dispatch:uiDispatch} = useUiContext();
      const {state:userState , dispatch:userDispatch} = useUserContext();
      const {state:state , dispatch:dispatch} = useAppContext();
      const navigator = useNavigate()
  
      useEffect(()=>{

        
        const Auth =  async()=>{ 
          const au =  new Authenticate()
          uiDispatch({type: "loading"})
          const checkToken = await au.checkToken()
          uiDispatch({type:"stop.loading"})
          // redirect to the login if token is invalid
          console.log(checkToken)
          if (!checkToken.state) {
            navigator("/login")
          }else { 
            navigator("/")
          }
          return userDispatch({type: "user.set-user" , payload : checkToken.data})
          
          // return navigator("/dashboard")

        }
        Auth()

        // check the JWT token
      },[])

    return (
      <>
          {uiState.loading ? <Loader/> : null}
          {uiState.modal ? <Modal/> : null}
          <Router/>
      </>
    )
  }

  export default function App() { 

    return (
      <>   

        <CustomProvider>
          <UiProvider>
            <UserProvider>
                <AppProvider>
                    {/* <TabProvider> */}
                        <AppContent />
                    {/* </TabProvider> */}
              </AppProvider>
            </UserProvider>
          </UiProvider>
        </CustomProvider>
        

      </>

    )
  }