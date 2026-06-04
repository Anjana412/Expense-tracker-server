import express from "express";
import cors from 'cors';
import { connectDB } from "./utils/db.js";
import 'dotenv/config'
import userrouter from "./Routes/userRoutes.js";
import expenserouter from "./Routes/expenseRoutes.js";

const app = express();
app.use(cors())
app.use(express.json());
app.use('/user',userrouter);
app.use('/expense',expenserouter)



const PORT = 4000;

connectDB().then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("DB connection failed:",err.message);
    
});
