import express from 'express';

import { getWorkspacesUserIsMemberOfController } from '../../controllers/workspaceController.js';
import { deleteWorkspaceController } from '../../controllers/workspaceController.js';
import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { getWorkspaceController } from '../../controllers/workspaceController.js';
import { getWorkspaceByJoinCodeController } from '../../controllers/workspaceController.js';
import { resetJoinCodeController } from '../../controllers/workspaceController.js';
import { updateWorkspaceController } from '../../controllers/workspaceController.js';
import { addMemberToWorkspaceController } from '../../controllers/workspaceController.js';
import { addChannelToWorkspaceController } from '../../controllers/workspaceController.js';
import { joinWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { addMemberToWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { addChannelToWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';
const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validate(createWorkspaceSchema),
  createWorkspaceController
);


router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

router.get('/:workspaceId', isAuthenticated, getWorkspaceController);


router.get('/join/:joinCode',isAuthenticated,getWorkspaceByJoinCodeController);

router.put('/:workspaceId/join', isAuthenticated, joinWorkspaceController);

router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);

router.put('/:workspaceId/members',isAuthenticated,validate(addMemberToWorkspaceSchema),addMemberToWorkspaceController);

router.put('/:workspaceId/channels',isAuthenticated,validate(addChannelToWorkspaceSchema),addChannelToWorkspaceController);


router.put(
  '/:workspaceId/joinCode/reset',
  isAuthenticated,
  resetJoinCodeController
);

export default router;