import {Router} from 'express';
import type {ConfigType} from '$/config/confighelper';
import createAuthApiRouter from '$/routes/api/v1/auth';
import createUserApiRouter from '$/routes/api/v1/user';
import createUserSessionsApiRouter from '$/routes/api/v1/usersession';
import createLabelApiRouter from '$/routes/api/v1/label';

export function createApiRouter(config: ConfigType): Router {
  const router = Router();
  router.use('/auth', createAuthApiRouter(config));
  router.use('/label', createLabelApiRouter());
  router.use('/user', createUserApiRouter());
  router.use('/usersession', createUserSessionsApiRouter());
  return router;
}
