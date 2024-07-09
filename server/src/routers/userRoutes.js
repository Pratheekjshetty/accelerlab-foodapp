import express from 'express'
import {loginUser,registerUser,editUser,getUser} from '../controllers/userControllers.js'
import authMiddleware from '../middleware/auth.js';
import authMiddleware1 from '../middleware/auth1.js';
import multer from 'multer'

const userRouter = express.Router()

//Image Storage Engine
const storage = multer.diskStorage({
    destination: "user-uploads",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
});

const upload = multer({storage:storage})

userRouter.post('/register',upload.single('image'),registerUser);
userRouter.post('/login',upload.none(),loginUser);
userRouter.put('/edit-user', authMiddleware1, upload.single('image'), editUser);
userRouter.get('/get-user', authMiddleware1, getUser);

export default userRouter; 