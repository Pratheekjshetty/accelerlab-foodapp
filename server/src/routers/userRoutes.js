import express from 'express'
import {loginUser,registerUser} from '../controllers/userControllers.js'
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

userRouter.post('/register',upload.single('image'),registerUser)
userRouter.post('/login',upload.none(),loginUser)

export default userRouter; 