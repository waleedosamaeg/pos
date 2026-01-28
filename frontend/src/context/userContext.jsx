import {useContext , createContext , useReducer} from "react";


const UserContext = createContext()
const initState = {
    user : null , 

}
const reducer = (state , action)=>{
    console.log(state)
    switch (action.type) { 
        case "user.login" : 
            return {...state , user : action.payload}
        case "user-logout" : 
            return { ...state , user : null}
        default : 
            return state
    }
    
}

const UserProvider = ({children})=>{
    const [state , dispatch] = useReducer(reducer , initState)
    return (
        <UserContext.Provider value = {{state , dispatch}}>
            {children}
        </UserContext.Provider>
    )
}


const useUserContext = ()=>{
    return useContext(UserContext);
}


export {UserProvider , useUserContext}