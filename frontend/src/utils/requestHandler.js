import axios from "axios"

class RequestHandler { 
    

    async  get(endpoint = "http://localhost:4321/" ) { 
        try { 
            const request = await axios.get(endpoint)
            const response = request.data
            return response


        }catch (error)  { 
            return { state : false , reason : error.message}
        }
    }

     async post(endpoint = "http://localhost:4321/" , data = {} , headers = {}) { 
        try { 
            const request =  await axios.post(endpoint , data  , {headers});
            const response = request.data 
            return  response


        }catch (error)  { 
            return { state : false , reason : error.message}
        }
    }
}
export default RequestHandler