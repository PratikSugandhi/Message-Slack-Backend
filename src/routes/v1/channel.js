import express from 'express';

import {
  deleteChannelController,
  getChannelByIdController
} from '../../controllers/channelController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/:channelId', isAuthenticated, getChannelByIdController);
router.delete('/:channelId', isAuthenticated, deleteChannelController);

export default router;