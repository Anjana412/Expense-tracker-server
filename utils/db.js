import mongoose from "mongoose";
import 'dotenv/config'

const DB_url = process.env.url;

export async function connectDB() {
    try{
        await mongoose.connect(DB_url)
        console.log("Database connected");
        
    }
    catch(error){
        console.log("Database not connected",error.message);
        
    }
}