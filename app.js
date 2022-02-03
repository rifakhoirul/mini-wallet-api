import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Response from './utils/Response.js';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import walletRouter from './routes/wallet.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/miniwalletdb');
}

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(cors());

app.use('/api/v1', walletRouter);

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json(new Response({
        error: err.message,
    }, "fail"));
})

app.use((req, res) => {
    res.status(404).json(new Response({
        error: "Route not found",
    }, false));
});

export default app;
