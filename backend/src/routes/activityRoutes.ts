import { Router } from 'express';
import {
  getActivitiesByPet,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authenticateToken);

// Nested pet routes: /api/pets/:petId/activities
router.get('/pets/:petId/activities', getActivitiesByPet);
router.post('/pets/:petId/activities', createActivity);

// Direct routes: /api/activities/:id
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);

export default router;
