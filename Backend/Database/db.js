import mongoose from "mongoose";

export const connectDB =  () => {
    mongoose.connect(process.env.MONGODB_URL,{
        dbName: "MERN LMS"
    }

    ).then(()=>{
        console.log("Database connected successfully");
    })
    .catch((err)=>{
        console.log("Database connection failed", err);
    });
}