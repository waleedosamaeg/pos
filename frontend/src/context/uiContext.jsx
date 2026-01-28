import { createContext , useContext , useReducer } from "react";


const UiContext = createContext()

const reducer = (state , action)=>{
    switch (action.type) { 
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
        case "set-theme" : 
            return {...state , theme : action.payload}
        case "confirm" : 
            return {...state , confirm : action.payload}
        case "remove.confirm" : 
            return {...state , confirm : null}
        default : 
            return state

}}
const UiProvider =  ({children})=> {
    const initState = {
        theme : "dark" , 
        loading : false , 
        modal : null ,
        confirm : null,
        lang : "en"
    }

    const [state , dispatch]= useReducer( reducer , initState)

    return (
        <UiContext.Provider value = {{state , dispatch}}>
            {children}
        </UiContext.Provider>

    )
}

const useUiContext = ()=>{
    return (
        useContext(UiContext)
    )
}

export {useUiContext , UiProvider};