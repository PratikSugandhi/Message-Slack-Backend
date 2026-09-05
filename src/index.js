import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import ChannelSocketHandlers from './controllers/channelSocketController.js';
import MessageSocketHandlers from './controllers/messageSocketController.js';
import { verifyEmailController } from './controllers/workspaceController.js';
import apiRouter from './routes/apiRoutes.js';

const app = express();

const server = createServer(app); // create the http server on app or express server.
const io = new Server(server, {
  cors: {
    origin: "https://messageslackbackend.onrender.com",
    credentials: true
  }
});
app.use(cors({
    origin: "https://messageslackbackend.onrender.com",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/verify/:token', verifyEmailController);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  MessageSocketHandlers(io, socket);
  ChannelSocketHandlers(io, socket);
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
