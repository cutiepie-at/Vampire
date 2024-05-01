import {Router} from 'express';
import type {ConfigType} from '$/config/confighelper';
import createAuthApiRouter from '$/routes/api/v1/auth';
import createUserApiRouter from '$/routes/api/v1/user';
import createUserSessionsApiRouter from '$/routes/api/v1/usersession';

export function createApiRouter(config: ConfigType): Router {
  const router = Router();
  router.use('/auth', createAuthApiRouter(config));
  router.use('/user', createUserApiRouter());
  router.use('/usersession', createUserSessionsApiRouter());
  return router;
}
