import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface PersonResponse {
    slackId: string;
    name: string;
    teamId: string;
    isBot: boolean,
}

export interface IPerson extends ITimeStampedDocument, PersonResponse {}

interface IPersonModel extends Model<IPerson> { }

const schema = new Schema<IPerson>({
    slackId: { type: String, index: true, required: true },
    teamId: { type: Number, index: true, required: true },
    name: { type: String, index: true, required: true },
    isBot: { type: Boolean, index: true, required: true }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Person: IPersonModel = model<IPerson, IPersonModel>('Person', schema);

export default Person;
