import express from 'express'
import cors from 'cors'
import connectDB from '../server/src/helper/db.js'
import foodRouter from '../server/src/routers/foodRoutes.js'
import userRouter from '../server/src/routers/userRoutes.js'
import 'dotenv/config'
import cartRouter from '../server/src/routers/cartRoutes.js'
import orderRouter from '../server/src/routers/orderRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app config
const app=express()
const port=4000

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

//api endpoints
app.use('/api/food',foodRouter)
app.use('/images',express.static('uploads'))
app.use('/user-uploads', express.static(path.join(__dirname, 'user-uploads')))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("Api Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})