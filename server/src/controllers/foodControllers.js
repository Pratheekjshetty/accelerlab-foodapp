import foodModel from '../models/foodModels.js'
import fs from 'fs'
//add food
const addFood = async(req,res)=>{
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save();
        res.json({success:true,message:"Food Added"});
    } catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}
//list all food
const listFood =async(req,res)=>{
    try{
        const foods=await foodModel.find({});
        res.json({success:true,data:foods})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}
//list active food
const listActiveFood =async(req,res)=>{
    try{
        const foods=await foodModel.find({is_Active: "1"});
        res.json({success:true,data:foods})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}
//remove food
const removeFood=async(req,res)=>{
    try{
        const food =await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}
//deactivate food
const deactivateFood=async(req,res)=>{
    try{
        const food =await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }
        food.is_Active = "0";
        await food.save();
        res.json({ success: true, message: "Food Deactivated" });
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})
    }
}
//edit food
const editFood =async(req,res)=>{
    try{
        console.log("Request Body:", req.body);
        const foodId = req.body.id;
        if (!foodId) {
            return res.json({ success: false, message: "Food ID not provided" });
        }
        console.log("Food ID:", foodId);
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        // If a new image is uploaded, replace the old one
        if (req.file) {
            console.log("Replacing image:", food.image);
            fs.unlink(`uploads/${food.image}`, () => {});
            food.image = `${req.file.filename}`;
        }
        // Update other car details
        food.name = req.body.name || food.name;
        food.description = req.body.description || food.description;
        food.price = req.body.price || food.price;
        food.category = req.body.category || food.category;
        await food.save();
        res.json({ success: true, message: "Food Updated" });
    }catch(err){
        console.log(err);
        res.json({ success: false, message: "Error" });
    }
}
export {addFood,listFood,listActiveFood,removeFood,deactivateFood,editFood}