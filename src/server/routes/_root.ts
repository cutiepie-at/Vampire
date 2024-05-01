import {type NextFunction, type Request, type Response, Router} from 'express';
import type {ViteDevServer} from 'vite';
import * as RootController from '$/controllers/_root';

export default function createRootRouter(vite: ViteDevServer): Router {
  const router = Router();

  //index.html
  router.get('*', (req: Request, res: Response, next: NextFunction) => RootController.index(req, res, next, vite));

  return router;
};
