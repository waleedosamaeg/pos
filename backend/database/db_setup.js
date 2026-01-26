import Tables from "./tables.js"
import permissionsRecords from "./records/permissions.js"
import rolesRecords from "./records/roles.js"
import rolePermissionsRecords from "./records/role_permissions.js"
import accountsRecords from "./records/accounts.js"
import extraPermissionsRecords from "./records/extraPermissions.js"
import unitsRecords from "./records/units.js"

import mysql from "mysql2/promise"
import { error as e  , info } from "../utils/logger.js"

const tables = Tables



export class Database { 
    constructor(config) { 
        info(`Connecting to MYSQL Server With Credentials ${process.env.DB_USER}@${process.env.DB_HOST} to Database "${process.env.DB_NAME}"  `)
        this.config = {host: process.env.DB_HOST , user : process.env.DB_USER , password  : process.env.DB_PASS || "" , database : process.env.DB_NAME}
    }

   async  setup() { 
      
       
        try { 
            info("Starting Database Setup ...")
            const connection = await mysql.createConnection(this.config)
            info("Connected to MySQL server ✅");
            info("Creating Database Tables , Please Wait ...")
            tables.map(async (item  , index , srcArray)=>{
                await connection.execute(item , [])
                // console.log("Query Executed !")
            })

        
            info("Adding Default tables Records ↓ ")
            
            // add Permessions table  default records
            
            info("Adding `Permessions`  Records ...")
            permissionsRecords.map(async (item , index , srcArray)=>{
                await connection.execute( item , [])
            })
            // add roles table default records
            info("Adding  `Roles`  Records ...")
            rolesRecords.map(async(item)=>{
                await connection.execute(item , [])
            })

            // add role_permissions table default records 
            info("Adding `role_permissions`  Records ...")
            rolePermissionsRecords.map(async(item)=>{
                await connection.execute(item , [])
            })
           // add accounts   default records 
            info("Adding `accounts`  Records ...")
            accountsRecords.map(async(item)=>{
                await connection.execute(item , [])
            })

            // add extra_permissions default records 
            info("Adding `extra_permissions` default  Records ...")
            extraPermissionsRecords.map(async(item)=>{
                await connection.execute(item , [])
            })
            // add units default records 
            info("Adding `units` default  Records ...")
            unitsRecords.map(async(item)=>{
                await connection.execute(item , [])
            })

            // close the initialize Connection
            await connection.end();
           
        }catch(error)  { 
            console.error("Database initialization failed ❌", error);
            e(error)
            process.exit(1)
            // throw error
        }
    }
    connect() { 

    }
    query() { 

    }
}