import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Task from '../../models/Task';
import BadRequest from '../../errors/bad-request';
import Person from '../../models/Person';

const assignee = Joi.object().keys({
    name: Joi.string().required(),
    teamId: Joi.string().required(),
    isBot: Joi.boolean().required()
});
export const addTaskSchema = Joi.object().keys({
    name: Joi.string().required(),
    assignees: Joi.array().items(assignee).required()
});

interface AddReqBody {
  name: string;
  assignees: Array<{ name: string, teamId: string, isBot: boolean }>;
}

const add: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
    const { name, assignees } = req.body;
    let foundAssignees = [];

    const task = await Task.findOne({ name: name });
    if (task) {
        return new BadRequest('This task name already exists');
    }
    //
    // Add new people if they not exists in db
    foundAssignees = await Promise.all(assignees.map(async (assignee: {name: string, teamId: string, isBot: boolean}): Promise<string> => {
        const upsertAssignee = await Person.findOneAndUpdate({ name: assignee.name, teamId: assignee.teamId }, assignee, { upsert: true });
        return upsertAssignee?._id;
    }));

    const newTask = new Task({ name, assignees: foundAssignees });
    await newTask.save();
    //
    res.send({
        message: 'Saved',
        task: newTask
    });
};

export default requestMiddleware(add, { validation: { body: addTaskSchema } });
