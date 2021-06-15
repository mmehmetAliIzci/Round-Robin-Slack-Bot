import { Model, model, Schema } from 'mongoose';
import TimeStampPlugin, { ITimeStampedDocument } from './plugins/timestamp-plugin';

export interface ITask extends ITimeStampedDocument {
    /** Name of the task */
    name: string;
    assignees: [];
    assignee: string;
}

interface ITaskModel extends Model<ITask> { }

const schema = new Schema<ITask>({
    name: { type: String, index: true, required: true, unique: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    assignee: { type: Schema.Types.ObjectId, ref: 'Person' }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Task: ITaskModel = model<ITask, ITaskModel>('Task', schema);

export default Task;
