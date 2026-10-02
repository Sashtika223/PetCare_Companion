import { Router } from 'express';
import { getCareTips, getCareTipById } from '../controllers/careTipController.js';

const router = Router();

router.get('/', getCareTips);
router.get('/:id', getCareTipById);

export default router;
