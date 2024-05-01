import {Router} from 'express';
import UserSessionController from '$/controllers/api/v1/UserSessionController';
import {isAuthenticatedMiddleware} from '$/middleware/auth';

export default function createUserSessionsApiRouter(): Router {
  const controller = new UserSessionController();
  const router = Router();
  // router.get('/', Controller.list);
  router.get('/:userId', isAuthenticatedMiddleware, controller.list.bind(controller));
  // router.get('/:userId/:id', Controller.getById);
  // router.post('/', Controller.add);
  // router.put('/', Controller.update);
  router.delete('/:id', isAuthenticatedMiddleware, controller.remove.bind(controller));
  return router;
};