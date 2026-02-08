import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {user} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const register= catchAsyncError (async (req, res, next) => {
    try{
        const {name, email, password}= req.body;
        if(!name||!email||!password){
            return next(new ErrorHandler("Please fill all the fields", 400));
        }
        const isRegistered= await user.findOne({email,accountVerified:true});
        if(isRegistered){
            return next(new ErrorHandler("User already registered, please login", 400));
        }


        const registerationAttemptByUser= await user.findOne({email,accountVerified:false});
        if(registerationAttemptByUser && registerationAttemptByUser.length>=5){
           return next(new ErrorHandler("Maximum registeration attempts exceeded. Please contact support.", 400));
        }

        if(password.length<8||password.length>16){
            return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
        }

        const hashedPassword= await bcrypt.hash(password, 10);
        const user = await user.create({
            name,
            email,
            password: hashedPassword,
            accountVerified: false,
        });

    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
});