import variables from "@config/variables.js"
import RequestHandler from "@util/requestHandler.js";
class Authenticate { 

    #getToken() { 

        const token  = localStorage.getItem("token");
        if (!token) { 
            return false
        }
        return token
    }

    checkToken() { 
        const endpoint = `${variables.apiUrl}/auth/verify`;
        const token = this.#getToken();
        if (!token) { 
            return {state : false }
        }
        const requester = async ()=>{
            const headers = {
                Authorization : `Bearer ${token}`
            }
            const data = {}
            
            const request = await new RequestHandler().post(endpoint , data , headers)
            const response = request.data 
            return response
            
        }
        return requester()

    }

    



}

export default Authenticate