import express from 'express';
import customerRoutes from './routes/cutomerRoutes';

const app = express();
app.use(express.json());

app.use('/',customerRoutes);
app.get('/ping',(_req,res)=>{
    res.send('pong');
});

export default app;

