import {  createContext  , useContext , useReducer} from "react";

const AppContext = createContext();
const initialState = {
    user : null , 
    theme : 'dark' , 
    loading : false , 
    lang : "ar",
    modal : null

}

function appReducer(state  , action )  {
    switch (action.type)  {
        case "user.set-user" : 
            return {...state , user : action.payload}
        case "user.logout" : 
            return {...state , user : null} 
        case "loading" : 
            return {...state , loading : true}
        case "stop.loading" : 
            return {...state , loading : false} 
        case "modal" : 
            return {...state , modal : action.payload}
        case "remove.modal" : 
            return {...state , modal : null}
        case "set-lang" : 
            return {...state , lang : action.payload}

        default : 
            return state
    }
}

export function AppProvider({children}){
    const [state , dispatch] = useReducer(appReducer , initialState);
    return (
        <AppContext.Provider value = {{state , dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() { 
    return useContext(AppContext)
}