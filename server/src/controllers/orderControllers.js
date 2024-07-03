import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

//placing user order for frontend
const placeOrder = async (req,res)=>{
    const frontend_url = "http://localhost:3001"
    try{
        const newOrder =new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
        const amountInPaise = req.body.amount * 100; 

        const options = {
            amount: amountInPaise, 
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });
    }
    catch(err){
        console.error(err);
        res.json({ success: false, message: "Order Creation Error" });
    }
}
const verifyOrder = async(req,res)=>{
    const{orderId,success}=req.body;
    try{
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    }
    catch(err){

        console.log(err);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async (req,res)=>{
    
}

export {placeOrder,verifyOrder,userOrders}