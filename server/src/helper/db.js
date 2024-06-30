import mongoose from "mongoose"

const connectDB =async()=>{
    try{
        const url="mongodb://127.0.0.1:27017/food_app";
        await mongoose.connect(url);
        console.log("Connected to DB");
    }
    catch(err){
        console.log(err);
        console.log("Error while Connecting to DB");
    }  
};
export default connectDB;