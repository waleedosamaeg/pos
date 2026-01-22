import TokenHandler from "./jwtToken.js"
import {error} from "../utils/logger.js"


const Authorize = (permession)=>{
    
    const middleware = (req , res , next)=>{
            try { 

                const authHeader = req.headers.authorization;
               
                
                if (!authHeader  ) { 
                return  res.status(401).json({state:false , reason : "no.token.provided"})
                }
                const headerParts = authHeader.split(/\s+/)
                const token = headerParts[1]
                if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== "bearer" || !token) {
                     return res.status(401).json({state:false , reason : "authorization.header.malformed"})
                } 
                
                if (token.split(".").length !== 3) { 
                    return res.status(401).json({state: false , reason :"jwt.token.malformed !"})

                }
            
                const decoded = new TokenHandler().verify(token)
                if(!decoded.state) { 
                    return res.status(401).json({state: false , reason :"invalid Signature !"})
                }
                // check the permession 
                const userPermessions = decoded.data.permessions
     
                if (!userPermessions.includes(permession.toLowerCase()))  { 
                    return res.status(401).json({state:false , reason : "unauthorized !"})
                }
                next()
            

            }catch(e) { 
                error(e)
                return res.status(500).json({state: false , reason : "internal.error"})
            }
    }

    return middleware
}

export default Authorize