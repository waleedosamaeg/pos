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

     async checkToken() { 
        const endpoint = `${variables.apiUrl}/auth/verify`;
        const token = this.#getToken();
        if (!token) { 
            return {state : false }

        }
    
        const headers = {
            Authorization : `Bearer ${token}`
        }
        const data = {}
        
        const response = await new RequestHandler().post(endpoint , data , headers)
        return response
        
    
    
       

    }

    



}

export default Authenticate