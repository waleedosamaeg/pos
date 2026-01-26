import express from "express"
import PermAuth from "../middlewares/permAuthorize.js"
import ProductHandler from "../utils/products/handler.js"
import { error } from "../utils/logger.js";

const Router = express.Router();
const handler = new ProductHandler();

Router.post("/product/add" , PermAuth("product.add"),  async (req , res , next)=>{
    try { 
            const name = req.body?.name;
            const ar_name = req.body?.ar_name; 
            const desc = req.body?.desc;
            const category = req.body?.category ;
            const units = req.body?.units;
        
            const add =  await handler.add({name  , ar_name , category , desc , units })
            
            return res.status(200).json(add) 

    }catch (e) { 
        error(e)
        return res.status(500).json({state :false , reason : "internal.error"})
    }
  
})
Router.post("/product/remove" , PermAuth("product.remove") , async(req  , res , next)=>{
    try { 
        const id = req.body?.id
        return res.json(await handler.remove({id}))

    }catch (e) { 
        error(e)
        return res.status(500).json({state : false , reason : "internal.error"})
    }
  
})

Router.post("/product/edit" , PermAuth("product.edit") , async(req , res , next)=>{

    try { 
            const id = req.body?.id
            const name = req.body?.name 
            const ar_name = req.body?.ar_name 
            const category = req.body?.category
            const desc = req.body?.desc 

            return res.json(await handler.edit({id , name , ar_name , category , desc}))

        
    }catch (e) { 
            error(e) 
            return { state : false , reason: "internal.error"}
    }
})
export default Router