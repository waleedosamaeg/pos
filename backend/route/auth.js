import express from "express"
import Token from "../middlewares/jwtToken.js"
import fetchToken from "../utils/fetchToken.js"

const Router = express.Router()

Router.post("/auth/verify" , (req , res , next)=>{
    const data = fetchToken(req)
    if (!data.state) { 
        return res.status(401).json(data)
    }
    const verify  = new Token().verify(data.token)
    
    res.status(200).json(verify)

})

export default Router