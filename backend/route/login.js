import express from "express"
const router = express.Router()
import { error } from "../utils/logger.js"
import Authenticate from "../utils/authenticate.js"

export default router.post("/login" ,async (req , res )=>{
    try { 
            const a = new Authenticate(req.body.username , req.body.password);  
            const response =  await a.auth()
            return res.json(response)
    }catch (e) { 
        error(e.message)
        return res.json({state : false , reason : "internal.error"})
    }
   
})