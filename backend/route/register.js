import express from "express"
import Register from "../utils/register.js"
import permAuthorize from "../middlewares/permAuthorize.js"
const router = express.Router()

// fetch the create account permession id from the database 
router.post("/register" , permAuthorize("create.account") , async  (req , res) => { 

    
    const newAccount = new Register()
    newAccount.username = req.body.username ;
    newAccount.password = req.body.password;
    newAccount.nickname= req.body.nickname;
    newAccount.phone = req.body.phone;
    const acc = await newAccount.apply()
    res.json(acc)
    

})
export default router