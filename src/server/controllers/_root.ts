import type {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';
import type {ViteDevServer} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function index(req: Request, res: Response, next: NextFunction, vite: ViteDevServer): Promise<void> {
  if (res.headersSent) {
    next();
    return;
  }

  const url = req.originalUrl;

  try {
    let template = fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'index.html'),
      'utf-8',
    );

    template = await vite.transformIndexHtml(url, template);

    // 6. Send the rendered HTML back.
    res.status(200).set({'Content-Type': 'text/html'}).end(template);
  } catch (e) {
    // If an error is caught, let Vite fix the stack trace so it maps back to
    // your actual source code.
    vite.ssrFixStacktrace(e as Error);
    next(e);
    return;
  }
  next();
}