
import mongoose from "mongoose";

const connectDB = async () => {
    const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.dsr15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        
        // Additional error details
        if (error.name === 'MongoNetworkError') {
            console.error('Network-related error when attempting to connect to MongoDB.');
        } else if (error.name === 'MongoParseError') {
            console.error('Error parsing MongoDB connection string.');
        } else if (error.name === 'MongoTimeoutError') {
            console.error('Connection to MongoDB timed out.');
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any servers in your MongoDB Atlas cluster.');
        } else {
            console.error('An unknown error occurred while attempting to connect to MongoDB.');
        }

        process.exit(1);
    }
};

export default connectDB;