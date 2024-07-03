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

        // const line_items =req.body.items.map((item)=>({
        //     price_data:{
        //         currency:"inr",
        //         product_data:{
        //             name:item.name
        //         },
        //         unit_amount:item.price*100*80    //we get value in doler so multiply by 80
        //     },
        //     quantity:item.quantity
        // }))
        // line_items.push({
        //     price_data:{
        //         currency:"inr",
        //         product_data:{
        //             name:"Delivery Charges"
        //         },
        //         unit_amount:2*100*80
        //     },
        //     quantity:1
        // })
        //     const session = await razorpay.checkout.sessions.create({
        //         line_items:line_items,
        //         mode:'payment',
        //         success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        //         cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        //     })
        //     res.json({success:true,session_url:session.url})
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
        res.status(500).json({ success: false, message: "Order Creation Error" });
    }
}

export {placeOrder}