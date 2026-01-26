import db_handler from "../database/handler.js"
import {error} from "./logger.js"

class Shortcut { 
    constructor() {

    }

    async exists(shortcut) { 
   
        try { 
            if (!shortcut || !shortcut?.trim()) { 
                return { state : false , reason : "no.shortcut"}
            }
            const [rows] = await db_handler.execute(`SELECT shortcut from products where shortcut = ?` , [shortcut.trim()])
            if(rows.length > 0) {
                return { state : false , reason : "shortcut.exists"}
            }
            return { state : true  }

        }catch (e) { 
            error(e)
            return { state : false , reason : "internal.error"}
        }
    }
}

export default Shortcut