import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Task from '../../models/Task';
import BadRequest from '../../errors/bad-request';
import Person, { PersonResponse } from '../../models/Person';

const assignee = Joi.object().keys({
    name: Joi.string().required(),
    teamId: Joi.string().required(),
    isBot: Joi.boolean().required()
});
export const addTaskSchema = Joi.object().keys({
    name: Joi.string().required(),
    ownerTeamId: Joi.string().required(),
    assignees: Joi.array().items(assignee)
});

interface AddReqBody {
    name: string;
    ownerTeamId: string;
    assignees?: Array<PersonResponse>;
}

const add: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
    const { name, ownerTeamId, assignees } = req.body;
    let foundAssignees: string[] = [];

    const task = await Task.findOne({ name: name });
    if (task) {
        return new BadRequest('This task name already exists');
    }

    if (assignees?.length > 0) {
        foundAssignees = await Promise.all(assignees.map(async (assignee: PersonResponse): Promise<string> => {
            const upsertAssignee = await Person.findOneAndUpdate({ slackId: assignee.slackId }, assignee, { upsert: true });
            return upsertAssignee?._id;
        }));
    }

    // Add new people if they not exists in db
    const newTask = new Task({ name, ownerTeamId, assignees: foundAssignees });
    try {
        await newTask.save();
        res.send({
            message: 'Saved',
            task: newTask
        });
    } catch (e) {
        return new BadRequest(e.error);
    }
};

export default requestMiddleware(add, { validation: { body: addTaskSchema } });
