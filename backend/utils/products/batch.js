import {error} from "../logger.js"
import db_handler from "../../database/handler.js"
import Shortcut from "../shortcut.js"

class Batch { 
    constructor() {

    }
    async add({product_id , unit_id , expiry_date = null, cost_price , selling_price , stock = 0  , shortcut = null , created_by = null , no_profit = false}) { 
        const connection = await db_handler.getConnection()

        try { 

                if (!product_id || !Number.isInteger(product_id)) { 
                    return { state : false , reason : "invalid.product.id"}
                }

                if (!unit_id || !Number.isInteger(unit_id)) { 
                    return { state : false , reason :"invalid.unit.id"}
                }
            
                
                if (!cost_price || !Number.parseFloat(cost_price)) { 
                    return { state : false , reason : "invalid.cost.price"}
                }
                if (!selling_price || !Number.parseFloat(selling_price)) { 
                    return {state : false , reason : "invalid.selling.price"}
                }
                if (!stock || stock === 0 ) { 
                    return { state  :false , reason :"invalid.stock"}
                }
                 
               
                // create if shorcut exists
                const trimmedShortcut = shortcut ? shortcut.trim() : null

                if (trimmedShortcut) { 
                    const exists = await new Shortcut().exists(trimmedShortcut)
                    if (!exists.state)  return exists
                }


                // compare cost_price with selling price 
                if (selling_price < cost_price ) { 
                    return {state : false , reason : "cost.>.selling"}
                }
                if (selling_price === cost_price && !no_profit) { 
                    return {state: false , reason : "cost.=.selling"}
                }
               

                // start database transaction
                await connection.beginTransaction()
                const [rows] = await connection.execute( `INSERT INTO product_batches (product_id , unit_id , expiry_date , cost_price , selling_price , stock , shortcut , created_by) values ( ? , ? , ? , ? , ? , ? , ? , ?)`, [product_id,unit_id , expiry_date ? expiry_date : '2100-01-01' , cost_price , selling_price , stock , trimmedShortcut , created_by])
                if (rows && rows.affectedRows > 0 ) { 
                    await connection.commit();   
                    return { state : true , data : {insertId : rows.insertId}}
                }
                await connection.rollback()
                return { state : false , reason : "insert.failed"}
             
            }catch (e) { 
            error(e)
            // stop transaction --> rollback if there is error 
                await connection.rollback()
                return { state : false , reason : "internal.error"}
        }finally { 
            connection.release()
        }
      
    }
    async remove()  {

    }
    async edit() { 

    }
}
export default Batch