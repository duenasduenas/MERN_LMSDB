import mongoose from 'mongoose';


export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error){
        console.log("DATABASE CONNECTION ERROR", error)
        process.exit(1)
    }
}