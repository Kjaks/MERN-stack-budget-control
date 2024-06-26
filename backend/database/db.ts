import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI;

if (!url) {
    throw new Error('The MONGO_URI variable is not defined');
}

const connectToDatabase = () => {
    return mongoose.connect(url)
        .then(() => {
            console.log("¡Connected to MongoDB!");
        })
        .catch((error) => {
            console.error("¡Error connecting MongoDB!", error);
        });
};

const db = mongoose.connection;

db.on('open', () => {
    console.log("Open connection to MongoDB");
});

db.on('error', (error) => {
    console.error("Error in the connection with MongoDB", error);
});

export { connectToDatabase, db };
