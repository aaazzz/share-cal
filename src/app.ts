import { PrismaClient } from '@prisma/client';
import express from 'express';
import morganBody from 'morgan-body';
import dotenv from 'dotenv';
dotenv.config();

const createApp = (db: PrismaClient) => {

  const app = express();
  app.use(express.json());
  morganBody(app);

  app.post('/status', (req, res)=> {
    res.status(200).json({message: 'OK'});
  });

  app.get('/users', async (req, res) => {
    const allUsers = await db.user.findMany();
    res.status(200).json(allUsers);
  });
  return app;
}

export { createApp }
