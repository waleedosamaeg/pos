import db_handler from "../database/handler.js"
import {info , warn , error } from "../utils/logger.js"
// import GenerateToken from "../middlewares/generateJWT.js"
import Token from "../middlewares/jwtToken.js"

export default class Authenticate { 

    constructor(username , password ) { 
        this.username = username  || ""
        this.password = password  || ""
    }
    async auth() { 
        try { 
                // some input Validations ...
                if (this.username.trim() === "" || this.password.trim() === "") { 
                            return {state : false , reason : `empty.username.or.password`}
                }

                const [rows]  = await db_handler.execute(`SELECT * FROM accounts where username = ? and password = ?` , [this.username , this.password])

                
            
                
                // check if the username , password exists 
                if (rows.length !== 1) { 
                    return {state : false , reason : "invalid.username.or.password"}
                }
                const username = rows[0]?.username ;
                const nickname = rows[0]?.nickname;
                const id = rows[0]?.id;
                const last_seen = rows[0]?.last_seen;
                const super_admin = rows[0]?.super_admin
                const role_id = rows[0]?.role_id || 1
        
                const payload = {id , username  , nickname , last_seen , role_id , super_admin  }
                

                const token = new Token().generate(payload)
                
                return {state : true , data : {token , profile : payload}}
                // send token to the server
                }
        catch(e) { 
            error(e)
            return {state  : false , reason : e.message}
        }
    }
  }
