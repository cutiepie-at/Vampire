import type {Express} from 'express';
import type {ViteDevServer} from 'vite';
import {createApiRouter} from '$/api';
import type {ConfigType} from '$/config/confighelper';
import createRootRouter from '$/routes/_root';

export function registerRoutes(express: Express, vite: ViteDevServer, config: ConfigType) {
  express.use('/api/v1', createApiRouter(config));
  express.use('/', createRootRouter(vite));
}
