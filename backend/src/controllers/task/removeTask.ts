import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Task from '../../models/Task';
import BadRequest from '../../errors/bad-request';

interface ReqBody {
    name: string;
}

const removeTask: RequestHandler = async (req: Request<{}, {}, ReqBody>, res) => {
    const { name } = req.body;

    try {
        const result = await Task.deleteOne({ name });
        if (result.ok && result.deletedCount > 0) {
            res.send({
                message: 'Removed'
            });
        }
        return new BadRequest('Task deletion unsuccessful.');
    } catch (e) {
        return new BadRequest(e.error);
    }
};

export default requestMiddleware(removeTask);
