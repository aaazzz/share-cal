import { createServer } from 'http';
import { createApp } from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = createApp(prisma);
const httpServer = createServer(app);

const PORT = 3000;

httpServer.listen(PORT, async () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
