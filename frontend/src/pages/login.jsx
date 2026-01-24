  import React,  { useState } from 'react'
  import '@css/login.css'
  import { useTranslation } from 'react-i18next';
  import { useAppContext } from '@context/appContext.jsx';
  import logo from "@logo/logo-trans.png"
  import { useNavigate } from 'react-router-dom';

  export default React.memo(function Login() {
      const { t, i18n } = useTranslation();
      const navigator = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {state, dispatch} = useAppContext()
    console.log("test")
  
    
    const handleSubmit = (e) => {
      e.preventDefault()

      dispatch({type: "loading"})
      setTimeout(() => {
        console.log({ email, password })
          dispatch({type : "stop.loading"})

        alert('Login success')
      }, 1000)
    }

    return (
      <div className="login-container">
        <div className="login-logo">
            <img src={logo} alt="POS Logo"  />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{t('login.title')}</h2>

          <input
            type="text"
            placeholder= {t("login.username")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={state.loading}>
            {state.loading ? t('login.loading') : t("login.submit")}
        
          </button>
        </form>
      </div>
    )
  })
