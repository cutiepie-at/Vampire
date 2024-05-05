import {Router} from 'express';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import ValueController from '../../../controllers/api/v1/ValueController';

export default function createValueApiRouter(): Router {
  const controller = new ValueController();
  const router = Router();
  router.get('/', isAuthenticatedMiddleware, controller.list.bind(controller));
  router.get('/:id', isAuthenticatedMiddleware, controller.getById.bind(controller));
  router.post('/', isAuthenticatedMiddleware, controller.add.bind(controller));
  router.post('/batch', isAuthenticatedMiddleware, controller.addBatch.bind(controller));
  router.put('/', isAuthenticatedMiddleware, controller.update.bind(controller));
  router.delete('/:id', isAuthenticatedMiddleware, controller.remove.bind(controller));
  return router;
};