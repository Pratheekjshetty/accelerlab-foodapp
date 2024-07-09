import jwt from 'jsonwebtoken'

const authMiddleware1 = async (req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({success:false,message:"Not Authorized Login Again"})
    }
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = token_decode.id; 
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
}

export default authMiddleware1;