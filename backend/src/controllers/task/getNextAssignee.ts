import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Task, { ITask } from '../../models/Task';
import BadRequest from '../../errors/bad-request';
import Person, { IPerson } from '../../models/Person';

interface ReqBody {
    name: string;
}

function getNextAssigneeId (currentAssignee: string, assignees: Array<string>): string {
    const currentAssigneeIndex = assignees.findIndex((v) => v === currentAssignee);
    if (currentAssigneeIndex >= assignees.length) {
        return currentAssignee;
    } else {
        return assignees[currentAssigneeIndex + 1];
    }
}

const getNextAssignee: RequestHandler = async (req: Request<{}, {}, ReqBody>, res) => {
    const { name } = req.body;
    const task: ITask = await Task.findOne({ name: name });
    let assigneeId;

    if (!task) {
        throw new BadRequest('No task found');
    } else if (task.assignees?.length < 1) {
        throw new BadRequest('No assignees found');
    }

    if (!task.assignee) {
        // get the first one
        assigneeId = task.assignees[0];
    } else {
        // get the next one
        assigneeId = getNextAssigneeId(task.assignee, task.assignees);
    }

    task.assignee = assigneeId;
    await task.save();
    const assignee: IPerson = await Person.findById(assigneeId);

    res.send({
        message: 'Saved',
        assignee: assignee
    });
};

export default requestMiddleware(getNextAssignee);
