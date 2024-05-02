import {Router} from 'express';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import LabelController from '../../../controllers/api/v1/LabelController';

export default function createLabelApiRouter(): Router {
  const controller = new LabelController();
  const router = Router();
  router.get('/', isAuthenticatedMiddleware, controller.list.bind(controller));
  router.get('/:id', isAuthenticatedMiddleware, controller.getById.bind(controller));
  router.post('/', isAuthenticatedMiddleware, controller.add.bind(controller));
  router.put('/', isAuthenticatedMiddleware, controller.update.bind(controller));
  router.delete('/:id', isAuthenticatedMiddleware, controller.remove.bind(controller));
  return router;
};