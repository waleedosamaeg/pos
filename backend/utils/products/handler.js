import db_handler from "../../database/handler.js"
import {error} from "../logger.js"

class Product    { 

    constructor() { 

    }

    #checkId(id) { 
    
        if (!id || !Number.isInteger(id)) {
            return {state : false , reason : "invalid.product.id"}
        }
        
        
        return {state : true }
     
           
    }
    async add({name=null  , ar_name = null , category= 1 , description  = null}) { 
        try { 
            if (!name && !ar_name ) {
                return { state : false , reason :"no.name.provided"}
            }
            if (!ar_name && name ) { 
                ar_name = name 
            }
            if (!name && ar_name) { 
                name = ar_name
            }
           
            
            const [rows] = await db_handler.execute(`INSERT INTO products (name , ar_name , category_id , description) VALUES ( ? , ? , ? , ?)` , [name , ar_name , category , description])

            
            if (rows && rows.affectedRows > 0) { 
                return {state :true  , data : {productId : rows.insertId}}
            }
      
            return {state : false , reason : "insert.failed"}

        }catch (e) { 
            error(e);
            return {state : false , reason : "internal.error"}
        }
       
    }
    
    async remove({id}) { 
        try { 
            // if (!id) {
            //     return {state : false , reason : "no.product.id.provided"}
            // }
            
            // if (!Number.isInteger(id)) { 
            //     return {state : false , reason :  "invalid.id"}
            // }
            const checkId = this.#checkId(id)
            if(!checkId.state)  { 
                return checkId
            }
            // check if the product id exists 
            const [existing] = await db_handler.execute( `SELECT * FROM products where id = ?`, [id])
            if (existing.length === 0 ) { 
                return { state : false , reason : "no.product.found"}
            } 

     
            const [update] = await db_handler.execute(`UPDATE products set is_active = 0 WHERE id = ? ` , [id])
            if (update && update.affectedRows > 0) { 
                return { state : true , data : {productId: id}}
            }
            return { state : false , reason : "remove.failed"}
        }catch (e) { 
            error(e) 
            return {state : false  , reason : "internal.error"}
        }
        
    }

    async edit({id , name  = "", ar_name = "" , category = 1 , desc  = ""}){ 
      try { 
            const checkId = this.#checkId(id)
            if (!checkId.state) { 
                return checkId
            }

            if(!name?.trim() && !ar_name?.trim()) { 
                return { state : false , reason :"no.name.provided"}
            }
            const [update] = await db_handler.execute( `UPDATE products set name = ? , ar_name = ? , category_id = ? , description = ? where id = ?`, [name , ar_name , category , desc , id])
            if(update && update.affectedRows > 0) { 
                return {state : true , data : {productId : id}}
            }
            return {state: false  , reason :"update.failed"}
        }catch (e) { 
        error(e)
        return {state: false , reason :"internal.error"}
      }
    }
}
export default Product