import { Router } from 'express';

import {
  index,
  options,
  show,
} from '../controllers/atendimentos.controller.js';

const router = Router();

router.get('/', index);
router.get('/options', options);
router.get('/:id', show);

export default router;
