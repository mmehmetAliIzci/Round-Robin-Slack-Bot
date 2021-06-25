import requestMiddleware from '../../middleware/request-middleware';
import { addTaskSchema } from './addTask';
import { Request, RequestHandler } from 'express';
import Task, { ITask } from '../../models/Task';
import BadRequest from '../../errors/bad-request';
import Person, { PersonResponse } from '../../models/Person';

interface AddReqBody {
    name: string;
    ownerTeamId: string;
    assignees?: Array<PersonResponse>;
}

const addAssignee: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
    const { name, ownerTeamId, assignees } = req.body;
    const task: ITask = await Task.findOne({ name, ownerTeamId });
    let foundAssignees: string[] = [];

    if (!task) {
        throw new BadRequest('No task found');
    } else if (assignees?.length < 1) {
        throw new BadRequest('No assignees found');
    }

    foundAssignees = await Promise.all(assignees.map(async (assignee: PersonResponse): Promise<string> => {
        const upsertAssignee = await Person.findOneAndUpdate({ slackId: assignee.slackId }, assignee, { upsert: true, useFindAndModify: false, new: true });
        return upsertAssignee?._id;
    }));

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

export default requestMiddleware(addAssignee, { validation: { body: addTaskSchema } });
