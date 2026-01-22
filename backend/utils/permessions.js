import db_handler from "../database/handler.js"
import {error} from "./logger.js"

export default class  Permessions { 
    constructor()  {

    }
    async getall() { 
        try { 

            const [rows] = await db_handler.execute( `SELECT * FROM permessions ;`, [])

            return {state : true , data : rows}
        }catch (e)  {
            error(e)
            return {state : false , reason : "internal.error"}
        }
    }
}