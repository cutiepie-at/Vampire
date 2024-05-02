import {Router} from 'express';
import type {ConfigType} from '../../../config/confighelper';
import AuthController from '../../../controllers/api/v1/AuthController';

export default function createAuthApiRouter(config: ConfigType): Router {
  const controller = new AuthController(config);
  const router = Router();
  router.post('/register', controller.register.bind(controller));
  router.post('/login', controller.login.bind(controller));
  router.post('/verify', controller.verify.bind(controller));
  router.post('/logout', controller.logout.bind(controller));
  return router;
};