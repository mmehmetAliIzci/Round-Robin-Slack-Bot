import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Task, { ITask } from '../../models/Task';
import BadRequest from '../../errors/bad-request';

interface ReqBody {
    name: string;
}

const getByName: RequestHandler = async (req: Request<{}, {}, ReqBody>, res) => {
    const { name } = req.body;
    const task: ITask = await Task.findOne({ name: name });
    if (!task) {
        throw new BadRequest('No task found');
    }
    res.send({ task });
};

export default requestMiddleware(getByName);
