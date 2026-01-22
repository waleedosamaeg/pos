import { error } from "./logger.js"
import db from "../database/handler.js"
class Register { 
    constructor() { 

    }
    username = null
    password = null 
    nickname = null 
    phone = null

    async apply() { 

        try { 
                const username = this.username  || ""
                const password = this.password  || ""
                const nickname = this.nickname  || ""
                const phone = this.phone || ""

                // some input Validation 
                if (username.trim() === "" || password.trim() === "" || nickname.trim() === "" || phone.trim() === "") { 
                    return { state : false , reason :  "all.fields.required"}

                }
                // check phone Format 

                const pattern = /^01[0-9]{9,11}$/
                if (!pattern.test(phone))  { 
                    return {state : false , reason : "invalid.phone.number"}
                }
                


                // check availability of username and nickname field 
                const [checkUsername] = await db.execute(`SELECT username from accounts where username = ?` , [username])
                if (checkUsername.length !== 0) { 
                    return { state :false , reason : "username.exists"}
                }
                // check the availability of nickname field
                const [checkNickname] = await db.execute(`SELECT nickname from accounts where nickname = ?`  , [nickname])
                if (checkNickname.length !== 0) { 
                    return {state :false , reason : "nickname.exists"}
                }

                await db.execute(`INSERT INTO accounts (username , password , nickname , phone ) values ( ? , ? , ? , ?) ` , [username , password, nickname , phone])
                return {state: true , data : "account.created"}

            


        }catch(e) { 
            error(e.message)
            return {state : false , reason : "internal.error" }
        }
       
    }
}

export default Register