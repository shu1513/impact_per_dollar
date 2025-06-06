import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes';

dotenv.config();

const app = express();

// const corsOptions = {
//     origin:
//         process.env.NODE_ENV === 'production' 
//             ? process.env.FRONTEND_URL
//             : true,
//     credentials: true,
// };

app.use(cors());

app.use(express.json());

app.use('/',customerRoutes);
app.get('/ping',(_req,res)=>{
    res.send('pong');
});

export default app;

