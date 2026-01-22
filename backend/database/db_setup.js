import Tables from "./tables.js"
import permessionsRecords from "./records/permessions.js"
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
                const query = await connection.execute(item , [])
                // console.log("Query Executed !")
            })

            // clearing the Permessions Table to prenvent Duplicate
            await connection.execute(  "DELETE FROM permessions ", [])
            // add Permessions table  default records
            info("Adding Default Permessions table Records ...")
            permessionsRecords.map(async (item , index , srcArray)=>{
                await connection.execute( item , [])
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