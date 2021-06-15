import { RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Task from '../../models/Task';

const getAll: RequestHandler = async (req, res) => {
    const tasks = await Task.find();
    res.send({ tasks });
};

export default requestMiddleware(getAll);
