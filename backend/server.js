import dotenv from "dotenv"
dotenv.config()
import { Database } from "./database/db_setup.js"

import express from "express"
import cors from "cors"
import router from "./route/router.js"
import { info } from "./utils/logger.js"
async function Main() { 
    // setup and Creating database tables 
    // const db =  new Database()
    // await db.setup()


    const app =  express()
    // middlewares 
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(cors({origin:process.env.CORS_ORIGIN , methods : ["POST" , "GET"] , credentials : true}));
    app.use("/" , router);
    app.listen(process.env.APP_PORT  , ()=>{
        info(`Backend Server Now Running on Port : ${process.env.APP_PORT} ...`)
    })
    // start test Era

    

    // end Test Era 
}
Main()