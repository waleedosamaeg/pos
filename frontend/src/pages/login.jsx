  import React,  { useState } from 'react'
  import '@css/login.css'
  import { useTranslation } from 'react-i18next';
  import { useUiContext } from '@context/uiContext.jsx';
  import logo from "@logo/logo-trans.png"
  import login from '@util/login.js';
  import {useUserContext} from "@context/userContext.jsx"  
  import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';


  export default React.memo(function Login() {
      const { t, i18n } = useTranslation();
      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')
      const {state:uiState, dispatch:uiDispatch} = useUiContext();
      const {state:userState , dispatch:userDispatch} = useUserContext()
      const navigate = useNavigate()
      useEffect(()=>{
          if (userState.user) { 
            navigate("/")
          }
      }, [])
    const handleLogin =   async (e) => {
          e.preventDefault()
          uiDispatch({type: "loading"})
          const response =  await login({username , password})
          let title  , text ; 
          try  { 

            if(!response.state) { 
                title = t("handler.error.title")
                switch (response.reason ) { 
                  case "invalid.username.or.password":
                      i18n.language === "ar" ? text = "اسم المستخدم او كلمة المرور خاطئة" : text = "incorrect username or password "
                      break;
                  default : 
                    text = response.reason
                }
            
                uiDispatch({type : "modal" ,  payload : {title  , text}})

            }else { 
         
                userDispatch({type: "user.login" , payload : response.data})
                const token = response.data.token 
                const profile = response.data.profile 
                localStorage.setItem("token" , token)
                localStorage.setItem("profile" , JSON.stringify(profile))
                navigate("/")

            }


         
          }catch (e) { 
            title = t("handler.error.unexpexted.title")
            text = t("handler.error.unexpected.text") + `"${e.message}"`
            uiDispatch({type : "modal" ,  payload : {title  , text}})

          }finally { 

            uiDispatch({type:"stop.loading"})

          }
          
        
        
      
    }

    return (
      <div className="login-container">
        <div className="login-logo">
            <img src={logo} alt="POS Logo"  />
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h2>{t('login.title')}</h2>

          <input
            type="text"
            placeholder= {t("login.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={uiState.loading}>
            {uiState.loading ? t('login.loading') : t("login.submit")}
        
          </button>
        </form>
      </div>
    )
  })
