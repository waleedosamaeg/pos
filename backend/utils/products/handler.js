import db_handler from "../../database/handler.js"
import {error} from "../logger.js"
import UnitHandler from "./units.js"
import Shortcut from "../shortcut.js"


class Product    { 

    constructor() { 

    }

    #checkId(id) { 
    
        if (!id || !Number.isInteger(id)) {
            return {state : false , reason : "invalid.product.id"}
        }
        
        
        return {state : true }
     
           
    }
    async add({name=null  , ar_name = null , category= 1 , description  = null  , shortcut  , units }) { 
        

        const connection = await db_handler.getConnection();
        connection.beginTransaction()

      
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
            const trimmedShortcut = shortcut ? shortcut.trim() : null

            if (trimmedShortcut) { 
                const exists = await new Shortcut().exists(trimmedShortcut)
                if (!exists.state)  return exists
            }




           
            
            const [rows] = await connection.execute(`INSERT INTO products (name , ar_name , category_id , shortcut ,description) VALUES ( ? , ? , ? , ? ,  ?)` , [name , ar_name , category  , trimmedShortcut, description])

            
            if (!rows || rows.affectedRows === 0 ) { 
                    connection.rollback()
                    return {state : false , reason : "insert.failed"}
                }

            const product_id = rows.insertId

            const addUnit = await new UnitHandler().add({product_id , units , con:connection})
            if(!addUnit.state) { 
                await connection.rollback()
                return addUnit
            }
            await connection.commit()
            return addUnit
            
            
            

        }catch (e) { 
            error(e);
            connection.rollback()
            return {state : false , reason : "internal.error"}
        }finally{
            connection.release()
        }
       
    }
    
    async remove({id}) { 
        try { 
       
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