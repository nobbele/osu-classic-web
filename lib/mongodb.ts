import mongoose from 'mongoose'

const uri: string | undefined = process.env.MONGODB_URI;
const options: mongoose.MongooseOptions = {};

export default async function connectDb(): Promise<void> {
    if (mongoose.connection.readyState == 0) {
        if (uri) {
            await mongoose.connect(uri, options);
            console.log("Connected to MongoDB!");
        } else {
            throw new Error('Please add your Mongo URI to .env.local')
        }
    }
}