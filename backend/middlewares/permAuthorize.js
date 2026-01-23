import TokenHandler from "./jwtToken.js"
import {error , warn} from "../utils/logger.js"
import dbHandler from "../database/handler.js"
import permissionHandler from "../utils/permessions.js"


const Authorize = (permission)=>{
    
    const middleware = async (req , res , next)=>{
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

                if (decoded.super_admin === true) { 
                    return next()
                }

             
                // get Set of all user Permissions ↓
                const permHandler = new permissionHandler()
                const userPermissions = await permHandler.getUserPermissions(decoded.data.id)
                if (!userPermissions.state) { 
                    return res.status(500).json({state : false  , reason : "internal.error" })
                }


                const [permId] = (await dbHandler.execute(`SELECT id from permissions where name = ?` , [permission]))
            
                if (!userPermissions.data.has(permId[0]?.id)) { 
                    
                    if (!permId.length) { 
                        warn(`user-> "${decoded.data.username}" tried to Execute *Non Existing* Permission -> "${permission}" ! `)
                    }else { 
                        warn(`user-> "${decoded.data.username}" tried to Execute Permission -> "${permission}" and he hasn't have the Permission to do that !`)
                    }
                    return res.status(401).json({state : false , reason :"unauthorized !"})
                }


     
             
                return next()
            
                
            }catch(e) { 
                error(e)
                return res.status(500).json({state: false , reason : "internal.error"})
            }
    }

    return middleware
}

export default Authorize