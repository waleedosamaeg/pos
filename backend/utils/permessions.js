import db_handler from "../database/handler.js"
import {error} from "./logger.js"

export default class  Permessions { 
    constructor()  {

    }
    async getUserPermissions(userid) { 
        try { 
            const [userRoleRows] = await db_handler.execute(`SELECT role_id from accounts where id = ?` , [userid])
            const userRole  = userRoleRows[0]['role_id']
      
             // get all role permissions 
            const [permsRows] = await   (db_handler.execute( `SELECT permission_id from role_permissions where role_id = ?  `, [userRole]))
            const rolePermissions = permsRows.map( rolePermission => rolePermission.permission_id)
                    
            
            // get Extra Permissions 

                        
                
                const [extraPermsRows] = await db_handler.execute(`SELECT permission_id , type from extra_permissions where user_id = ?` , [userid])
                const extraPermissions = extraPermsRows.map((ep)=>{
                    return (
                        {id : ep.permission_id , type : ep.type}
                    )
                })
        
                let userPermissions = new Set(rolePermissions);
                extraPermissions.forEach((perm)=>{
                    if (perm.type === "allow") { 
                        userPermissions.add(perm.id)
                    }
                    if (perm.type === "deny") { 
                        userPermissions.delete(perm.id)
                    }
                })


             
                return {state  : true , data : userPermissions}
            

        }catch (e) { 
            error(e)
            return { state : false , reason : "internal.error" , error : e}
        }
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