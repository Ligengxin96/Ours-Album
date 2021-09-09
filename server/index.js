import { cpus } from 'os';
import cluster from 'cluster';
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

if (cluster.isPrimary) {
  console.log(new Date(), `Primary pid: ${process.pid} is running`);

  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(new Date(), `worker ${worker.process.pid} died, code: ${code}, signal: ${signal}`);
  });
} else {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '30mb', extended: true }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }));

  app.use('/Ours-Album/v1/post', postRouter);
  app.use('/Ours-Album/v1/user', userRouter);

  mongoose.connect(databaseConnectStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    app.listen(port, () => {
      console.log(new Date(), `Express server listening on port ${port} and worker pid: ${process.pid}`);
    });
  }).catch((error) => {
    console.log(new Date(), `Connect mongoose failed with error: ${error.message} and worker pid: ${process.pid}`);
  });
}
