import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import BadRequest from '../../errors/bad-request';
import Person from '../../models/Person';

export const addPersonSchema = Joi.object().keys({
    name: Joi.string().required(),
    teamId: Joi.string().required(),
    isBot: Joi.boolean().required()
});

interface AddReqBody {
    name: string;
    teamId: string;
    isBot: boolean;
}

const add: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
    const { name, teamId, isBot } = req.body;
    const person = await Person.findOne({ name, teamId });
    if (person) {
        throw new BadRequest('This person already exists');
    }

    const newPerson = new Person({ name, teamId, isBot });
    await newPerson.save();

    res.send({
        message: 'Person Saved',
        person: newPerson.toJSON()
    });
};

export default requestMiddleware(add, { validation: { body: addPersonSchema } });
