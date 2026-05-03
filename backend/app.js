import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import predictRouter from './routes/predict.js';

const app = express();

app.use(cors());
app.use(healthRouter);
app.use(predictRouter);

export default app;
