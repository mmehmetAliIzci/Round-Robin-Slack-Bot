import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IPerson extends ITimeStampedDocument {
    name: string;
    teamId: string;
    isBot: boolean,
}

interface IPersonModel extends Model<IPerson> { }

const schema = new Schema<IPerson>({
    teamId: { type: Number, index: true, required: true },
    name: { type: String, index: true, required: true },
    isBot: { type: Boolean, index: true, required: true }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Person: IPersonModel = model<IPerson, IPersonModel>('Person', schema);

export default Person;
