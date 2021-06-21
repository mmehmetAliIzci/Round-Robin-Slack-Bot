import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Task, { ITask } from '../../models/Task';
import BadRequest from '../../errors/bad-request';
import Person, { PersonResponse } from '../../models/Person';

export const assignee = Joi.object().keys({
    slackId: Joi.string().required(),
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
            const upsertAssignee = await Person.findOneAndUpdate({ slackId: assignee.slackId }, assignee, { upsert: true, useFindAndModify: false, new: true });
            return upsertAssignee._id;
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

const addAssignee: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
    const { name, ownerTeamId, assignees } = req.body;
    const task: ITask = await Task.findOne({ name, ownerTeamId });
    let foundAssignees: string[] = [];

    if (!task) {
        throw new BadRequest('No task found');
    } else if (task.assignees?.length < 1) {
        throw new BadRequest('No assignees found');
    }

    if (assignees?.length > 0) {
        foundAssignees = await Promise.all(assignees.map(async (assignee: PersonResponse): Promise<string> => {
            const upsertAssignee = await Person.findOneAndUpdate({ slackId: assignee.slackId }, assignee, { upsert: true, useFindAndModify: false, new: true });
            return upsertAssignee?._id;
        }));
    }

    task.assignees = task.assignees.concat(foundAssignees);
    await task.save();

    try {
        await task.save();
        res.send({
            message: 'Saved',
            task: task
        });
    } catch (e) {
        return new BadRequest(e.error);
    }
};

export const addNewTask = requestMiddleware(add, { validation: { body: addTaskSchema } });
export const addAssigneesToTask = requestMiddleware(addAssignee, { validation: { body: addTaskSchema } });
