import { connectToDatabase } from './database/db';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mongodbConnected = false;

const startServer = async () => {
    try {
        await connectToDatabase();
        mongodbConnected = true;

        const PORT = process.env.PORT || 5000;

        
        app.listen(PORT, () => {
            console.log(`Server is up and running at http://localhost:${PORT}`);
        });

        app.get('/api/message', (req: any, res: { json: (arg0: { message: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
            if (mongodbConnected) {
                res.json({ message: `Server and MONGODB is up and running at http://localhost:${PORT}` });
            } else {
                res.status(500).json({ error: 'MongoDB connection not established' });
            }
        });

    } catch (error) {
        console.error('Failed to start server', error);
    }
};

startServer();

