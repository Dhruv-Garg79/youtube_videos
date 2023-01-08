import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import controller from './controller';
import validation from './validation';

const videoRoutes = Router();

videoRoutes.get('/videos', validate(validation.getVideos), controller.getVideos);

export default videoRoutes;
