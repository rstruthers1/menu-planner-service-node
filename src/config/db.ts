import mongoose from "mongoose";

const MONGO_DB_URI: string = process.env.MONGO_DB_URI || '';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_DB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}