import express from "express"
import Permessions from "../utils/permessions.js"

const Router = express.Router()

Router.get("/permessions/all", async (req , res) => { 
    const allPermessions = await new Permessions().getall()
    res.json(allPermessions)

})

export default Router