import { Router } from 'express';
import { LinksController } from './controller.js';

const linksRouter = Router();
const controller = new LinksController();

// --- Public / Aggregated Views ---
linksRouter.get('/homepage', controller.getHomepage);
// Folder detail is also mapped to /folders/:id below (as GET /folders/:id)

// --- Categories ---
linksRouter.get('/categories', controller.getAllCategories);
linksRouter.post('/categories', controller.createCategory);
linksRouter.get('/categories/:id', controller.getCategory);
linksRouter.put('/categories/:id', controller.updateCategory);
linksRouter.delete('/categories/:id', controller.deleteCategory);

// --- Folders ---
linksRouter.get('/folders', controller.getAllFolders);
linksRouter.post('/folders', controller.createFolder);
linksRouter.get('/folders/:id', controller.getFolder); // Returns detail/aggregated view
linksRouter.put('/folders/:id', controller.updateFolder);
linksRouter.delete('/folders/:id', controller.deleteFolder);

// --- Subheadings ---
linksRouter.get('/subheadings', controller.getAllSubheadings);
linksRouter.post('/subheadings', controller.createSubheading);
linksRouter.get('/subheadings/:id', controller.getSubheading);
linksRouter.put('/subheadings/:id', controller.updateSubheading);
linksRouter.delete('/subheadings/:id', controller.deleteSubheading);

// --- Items (Links) ---
linksRouter.get('/items', controller.getAllLinks);
linksRouter.post('/items', controller.createLink);
linksRouter.get('/items/:id', controller.getLink);
linksRouter.put('/items/:id', controller.updateLink);
linksRouter.delete('/items/:id', controller.deleteLink);

export { linksRouter };
