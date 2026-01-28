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
  import ConfirmDialog from "@comp/confirmDialog.jsx"
  import Authenticate from "@util/Authentication.js";
  import { useNavigate } from "react-router-dom";
  import { useTranslation } from 'react-i18next';
  // import  { TabProvider } from "@context/tabContext.jsx";

  function AppContent() { 
      const {state:uiState ,dispatch:uiDispatch} = useUiContext();
      const {state:userState , dispatch:userDispatch} = useUserContext();
      const {state:state , dispatch:dispatch} = useAppContext();
      const navigator = useNavigate()
      const { i18n } = useTranslation();
  
      useEffect(()=>{
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', uiState.theme);
      }, [uiState.theme]);

      useEffect(()=>{
        // Apply language direction to document
        const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', direction);
        document.documentElement.lang = i18n.language;
      }, [i18n.language]);

      useEffect(()=>{
        const Auth =  async()=>{ 
          const au =  new Authenticate()
          uiDispatch({type: "loading"})
          const checkToken = await au.checkToken()
          uiDispatch({type:"stop.loading"})
          // redirect to the login if token is invalid
          console.log(checkToken)
          if (!checkToken.state) {
            // Only redirect to login if not on public routes
            const currentPath = window.location.pathname;
            const publicRoutes = ['/login', '/register'];
            if (!publicRoutes.includes(currentPath)) {
              navigator("/login")
            }
          }else { 
            navigator("/")
            userDispatch({type: "user.set-user" , payload : checkToken.data})
          }
        }
        Auth()

        // check the JWT token
      },[navigator, uiDispatch, userDispatch])

    return (
      <>
          {uiState.loading ? <Loader/> : null}
          {uiState.modal ? <Modal/> : null}
          {uiState.confirm ? <ConfirmDialog/> : null}
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