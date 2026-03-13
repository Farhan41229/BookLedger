import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {user} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
/**
 * Registers a new employee user in the system.
 * POST /api/users/register (example route)
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body.
 * @param {String} req.body.name - The full name of the employee.
 * @param {String} req.body.email - The unique email address to register.
 * @param {String} req.body.password - The desired password (must be between 8 and 16 characters).
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with status 201 on success, including the new user object (minus password).
 */
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
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            accountVerified: false,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    } catch(error) {
        console.error("Registration error:", error);
        return next(new ErrorHandler("An unexpected server error occurred during registration. Please try again later.", 500));
    }
});