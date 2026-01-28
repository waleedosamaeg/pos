import RequestHandler from "@util/requestHandler.js"
import Variables from "@config/variables.js"

const login = async ({username = "" , password = ""})=>{

    if (username.trim() === "" || password.trim() === "") { 
        return { state : false , reason :"no.username.or.password"}
    } 

    const endpoint = Variables.apiUrl + "/login"
    const requester =  await new RequestHandler().post(endpoint , {username , password} )
    return requester


}

export default login