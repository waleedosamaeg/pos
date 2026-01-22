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
                const role = rows[0]?.role;
                const id = rows[0]?.id;
                const last_seen = rows[0]?.last_seen;
                const permessions = []
                const payload = {id , username  , nickname , role , permessions}
                

                const token = new Token().generate(payload)
                
                return {state : true , data : {token , profile : payload}}
                // send token to the server
                }
        catch(e) { 
            error(e)
            return {state  : false , reason : e.message}
        }
    }
    // check the JWT Token 
    // verifyToken(token)  {
    //     try { 
    //         // verify the token with it's claims 
    //         const v = jwt.verify(token , this.#JWT_SECRET , {algorithms : [process.env.JWT_ALG] , issuer : process.env.JWT_ISSUER })
    //         return {state: true  , data : v}
    //     }catch(e) { 
    //         if (e.name === "JsonWebTokenError" && e.message === "invalid signature") { 
    //             return {state : false , reason : e.message}
    //         }
    //         error(`Verify Token Method Error ↓ [token]-> ${token} `)
    //         error(e)

    //         return {state : false , reason : e.message}
    //     }
    // }


    // #generateToken(payload) { 
    //     try { 
    //         return jwt.sign(payload , this.#JWT_SECRET , {expiresIn : process.env.JWT_EXPIRES , algorithm : process.env.JWT_ALG  , issuer : process.env.JWT_ISSUER })
    //     }catch(e) { 
    //         error("Generate Token Method Error ↓")
    //         error(e)
    //     }

    // }
}
