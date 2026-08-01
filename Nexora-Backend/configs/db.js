import mongoose from "mongoose";

const db=async()=>{
    try {
        const mongoDbUrl = process.env.MONGODB_URL;

        if (!mongoDbUrl) {
            throw new Error("MONGODB_URL is not configured");
        }

        await mongoose.connect(mongoDbUrl)
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

export default db();
