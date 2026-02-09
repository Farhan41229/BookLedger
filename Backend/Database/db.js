import mongoose from "mongoose";

export const connectDB =  () => {
    mongoose.connect(process.env.MONGODB_URL,{
        dbName: "MERN_LMS"
    }

    ).then(()=>{
        console.log("Database connected successfully");
    })
    .catch((err)=>{
        console.log("Database connection failed", err);
    });
}