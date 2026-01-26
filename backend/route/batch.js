import express from "express"
import Batch from "../utils/products/batch.js"
import { error } from "../utils/logger.js"
import PermAuth from "../middlewares/permAuthorize.js"
import TokenHanlder from "../middlewares/jwtToken.js"
import fetchToken from "../utils/fetchToken.js"

const Router = express.Router()

Router.post("/batch/add"  , PermAuth("batch.add"),  async (req , res , next)=>{

    try { 
        const product_id = req.body?.product_id 
        const unit_id = req.body?.unit_id
        const expiry_date = req.body?.expiry_date
        const cost_price = req.body?.cost_price 
        const selling_price = req.body?.selling_price
        const stock = req.body?.stock
        const shortcut = req.body?.shortcut
        const no_profit = req.body?.no_profit
        const {token} =  fetchToken(req)
        const {data : {id:user}} = new TokenHanlder().verify(token)

        const BatchHanlder = await new Batch().add({product_id , unit_id , expiry_date , cost_price , selling_price , stock , shortcut , created_by:user , no_profit})
        if (!BatchHanlder.status && BatchHanlder.reason === "internal.error")  { 
            return res.status(500).json(BatchHanlder)
        }
        return res.status(200).json(BatchHanlder)
    }catch (e) { 

        error(e)
        return res.status(500).json({state: false , reason : "internal.error"})
    }
   


 })
export default Router