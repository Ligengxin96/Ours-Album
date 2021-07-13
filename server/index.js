import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRouter from './routes/post.js';
import userRouter from './routes/user.js';

dotenv.config();

mongoose.set('useFindAndModify', false);

const port = process.env.PORT || 5000;
const databaseConnectStr = process.env.CONNECTION_URL;

const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use('/Ours-Album/v1/post', postRouter);
app.use('/Ours-Album/v1/user', userRouter);

mongoose.connect(databaseConnectStr, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
}).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}).catch((error) => {
  console.log(`Connect mongoose failed with error: ${error.message}`);
});