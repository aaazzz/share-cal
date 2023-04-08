import { createServer } from 'http';
import { createApp } from './src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
const app = createApp(prisma);
const httpServer = createServer(app);

httpServer.listen(3210, async () => {
  console.log(`🚀 Server ready at: http://localhost:3210`);
});