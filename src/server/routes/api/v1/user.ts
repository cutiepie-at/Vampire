import {Router} from 'express';
import UserController from '$/controllers/api/v1/UserController';
import {isAuthenticatedMiddleware} from '$/middleware/auth';

export default function createUserApiRouter(): Router {
  const controller = new UserController();
  const router = Router();
  router.get('/', isAuthenticatedMiddleware, controller.list.bind(controller));
  router.get('/:id', isAuthenticatedMiddleware, controller.getById.bind(controller));
  router.post('/', isAuthenticatedMiddleware, controller.add.bind(controller));
  router.put('/', isAuthenticatedMiddleware, controller.update.bind(controller));
  router.delete('/:id', isAuthenticatedMiddleware, controller.remove.bind(controller));
  return router;
};