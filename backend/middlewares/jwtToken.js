import jwt from "jsonwebtoken"
import {error} from "../utils/logger.js"
class Token {
    constructor() { 

    }

  

    generate(payload) { 

        try { 
                return jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRES , algorithm : process.env.JWT_ALG  , issuer : process.env.JWT_ISSUER })
            }catch(e) { 
                error("Generate Token Method Error ↓")
                error(e)
            }
    
                
    }
    verify(token) { 
        try { 
            // verify the token with it's claims 
            const v = jwt.verify(token , process.env.JWT_SECRET , {algorithms : [process.env.JWT_ALG] , issuer : process.env.JWT_ISSUER })
            return {state: true  , data : v}
        }catch(e) { 
            if (e.name === "JsonWebTokenError" && e.message === "invalid signature") { 
                return {state : false , reason : e.message}
            }
            error(`Verify Token Method Error ↓ [token]-> ${token} `)
            error(e)

            return {state : false , reason : e.message}
        }
    }
}

export default Token