import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiSpec from '../openapi.json';

import * as PersonController from './controllers/person';
import * as TaskController from './controllers/task';

const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }'
};

const router = Router();

// Book routes
router.post('/task/add', TaskController.addNewTask);
router.post('/task/add-assignee', TaskController.addAssigneesToTask);
router.post('/task/next-assignee', TaskController.getNextAssignee);
router.get('/task', TaskController.getByName);
router.get('/task/all', TaskController.getAll);
router.post('/person/add', PersonController.add);
router.get('/person/all', PersonController.getAll);

// Dev routes
if (process.env.NODE_ENV === 'development') {
    router.use('/dev/api-docs', swaggerUi.serve);
    router.get('/dev/api-docs', swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
