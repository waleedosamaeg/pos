    import db_handler from "../../database/handler.js"
    import {error} from "../logger.js"

    class Units {  
        constructor() { 

        }

        async add({product_id , units , con }) { 
            let connection;
            if (!con) { 
                connection = db_handler
            }else { 
                connection = con
            }

            try { 

                if (!product_id || !Number.isInteger(product_id)) { 
                    return { state : false , reason : "invalid.product.id"}
                }

                if (!Array.isArray(units) || units?.length === 0) { 
                    return { state : false , reason : "invalid.product.units"}
                }

                
                
                for (const unit of units) { 
                    if (!unit.id) { 
                        return {state :false , reason :"unit.id.required"}
                    }
                    if(!unit.quantity_in_base) { 
                        return {state :false , reason :"quantity_in_base.required"}
                    }
                    if(!unit.selling_price) { 
                        return {state : false , reason : "selling_price.required"}
                    }
                    
                    const [puRows] = await connection.execute(`INSERT INTO product_units (product_id , unit_id , quantity_in_base , selling_price) values (? , ? , ? , ?) ` , [product_id , unit.id , unit.quantity_in_base , unit.selling_price])
                        if (!puRows || puRows.affectedRows === 0) { 
                            return {state : false , reason : "insert.failed"}
                        }

                }
                
                return { state : true }
                
            }catch (e) { 
                error(e)
                return { state : false , reason : "internal.error"}
            }
        }
    }

    export default Units