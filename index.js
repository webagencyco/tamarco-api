import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connect } from 'mongoose';
import passport from './config/passportConfig.js';
import authRouter from './routes/authRoutes.js';
import numberRouter from './routes/numberRoutes.js';
import paymentRouter from './routes/payment.js';
import morgan from 'morgan';

dotenv.config({ path: "./.env" });
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

connect('mongodb://127.0.0.1:27017/virtual_numbers').finally(() => {
  console.log('Connected to MongoDB');
});

app.use(passport.initialize());
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/numbers', numberRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
