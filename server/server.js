import express from 'express'
import cors from 'cors'
import connectDB from './helper/db.js'
import foodRouter from './routers/foodRoutes.js'
import userRouter from './routers/userRoutes.js'
import 'dotenv/config'
import cartRouter from './routers/cartRoutes.js'
import orderRouter from './routers/orderRoutes.js'

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
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("Api Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})