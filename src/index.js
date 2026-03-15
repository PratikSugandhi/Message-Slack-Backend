// import cors from 'cors';
// import express from 'express';
// import {createServer} from 'http';
// import { StatusCodes } from 'http-status-codes';
// import { Server } from 'socket.io';

// import bullServerAdapter from './config/bullBoardConfig.js';
// import connectDB from './config/dbConfig.js';
// import { PORT } from './config/serverConfig.js';
// import ChannelSocketHandlers from './controllers/channelSocketController.js'
// import MessageSocketHandlers from './controllers/messageSocketController.js'
// import { verifyEmailController } from './controllers/workspaceController.js';
// import apiRouter from './routes/apiRoutes.js'

// const app = express();

// const server = createServer(app); // create the http server on app or express server.
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });
// app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/ui', bullServerAdapter.getRouter());

// app.use('/api', apiRouter);

// app.get('/verify/:token', verifyEmailController);

// app.get('/ping', (req, res) => {
//   return res.status(StatusCodes.OK).json({ message: 'pong' });
// });

// io.on('connection', (socket) => {
//    console.log('a user connected', socket.id);
//    MessageSocketHandlers(io, socket);
//   ChannelSocketHandlers(io, socket);
// });

// server.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectDB();
// });

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

const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// CORS configuration for Express
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bull dashboard
app.use('/ui', bullServerAdapter.getRouter());

// API routes
app.use('/api', apiRouter);

// Email verification route
app.get('/verify/:token', verifyEmailController);

// Health check route
app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

// Socket connection
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  MessageSocketHandlers(io, socket);
  ChannelSocketHandlers(io, socket);
});

// Start server
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

