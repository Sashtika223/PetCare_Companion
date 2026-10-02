import { Router } from 'express';
import {
  getVaccinationsByPet,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} from '../controllers/vaccinationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authenticateToken);

// Nested pet routes: /api/pets/:petId/vaccinations
router.get('/pets/:petId/vaccinations', getVaccinationsByPet);
router.post('/pets/:petId/vaccinations', createVaccination);

// Direct routes: /api/vaccinations/:id
router.put('/vaccinations/:id', updateVaccination);
router.delete('/vaccinations/:id', deleteVaccination);

export default router;
