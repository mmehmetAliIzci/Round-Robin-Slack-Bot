import { RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Person from '../../models/Person';

const getAll: RequestHandler = async (req, res) => {
    const people = await Person.find();
    res.send({ people });
};

export default requestMiddleware(getAll);
