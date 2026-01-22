import express from "express"
import loginRouter from "./login.js"
import registerRouter from "./register.js"
import PermessionsRouter from "./permessions.js"

const router = express.Router()
router.get("/" , (req , res)=>{
    res.json({state: true , data :  "express API !"})
})

router.use(loginRouter)
router.use(registerRouter)
router.use(PermessionsRouter)

export default router