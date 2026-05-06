import { Router } from 'express';
import { ShortLinksController } from './controller.js';

const shortlinksRouter = Router();
const controller = new ShortLinksController();

shortlinksRouter.get('/', controller.getAll);
shortlinksRouter.post('/', controller.create);
shortlinksRouter.get('/:id', controller.getById);
shortlinksRouter.put('/:id', controller.update);
shortlinksRouter.delete('/:id', controller.delete);

export { shortlinksRouter };
