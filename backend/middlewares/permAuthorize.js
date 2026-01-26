import TokenHandler from "./jwtToken.js"
import {error , warn , info} from "../utils/logger.js"
import dbHandler from "../database/handler.js"
import permissionHandler from "../utils/permessions.js"
import fetchToken from "../utils/fetchToken.js"


const Authorize = (permission)=>{
    
    const middleware = async (req , res , next)=>{
            try { 

                const data = fetchToken(req)
                if (!data.state) { 
                    return res.status(401).json(data)
                }
                const token = data.token
                const decoded = new TokenHandler().verify(token)
                if(!decoded.state) { 
                    return res.status(401).json({state: false , reason :"invalid Signature !"})
                }

                if (decoded?.data?.super_admin === 1) { 
                    info(`Bypassing Permission '${permission}' by User '${decoded.data.username}' due to 'super_admin' Previllage  `)
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