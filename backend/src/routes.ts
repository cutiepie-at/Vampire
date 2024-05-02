import {Express, static as _static} from 'express';
import {createApiRouter} from './api';
import type {ConfigType} from './config/confighelper';
import catchAllRedirect from './middleware/CatchAllRedirect';

export function registerRoutes(express: Express,  config: ConfigType) {
  express.use('/api/v1', createApiRouter(config));
  express.use(_static('_client')); //for production
  express.use(catchAllRedirect(express, '/'));
}
