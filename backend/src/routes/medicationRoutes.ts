import { Router } from 'express';
import {
  getMedicationsByPet,
  createMedication,
  updateMedication,
  deleteMedication,
} from '../controllers/medicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authenticateToken);

// Nested pet routes: /api/pets/:petId/medications
router.get('/pets/:petId/medications', getMedicationsByPet);
router.post('/pets/:petId/medications', createMedication);

// Direct routes: /api/medications/:id
router.put('/medications/:id', updateMedication);
router.delete('/medications/:id', deleteMedication);

export default router;
