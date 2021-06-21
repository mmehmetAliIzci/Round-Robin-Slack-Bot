import fetch from 'node-fetch';
import { Assignee } from '../model/Assignee';
import { Task } from '../model/Task';

export async function createTask (name: string, ownerTeamId: string, people?: Assignee[]): Promise<{ task?: Task; error?: string }> {
    const URL = `${process.env.BASE_URL}/task/add`;
    let body: { name: string, ownerTeamId: string, assignees?: Assignee[] } = {
        name,
        ownerTeamId: ownerTeamId,
        assignees: people
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const res: { message: string, task: Task } = await response.json();
            return Promise.resolve({ task: res.task });
        }
        return Promise.resolve({ error: 'Something went wrong' });
    } catch (e) {
        return Promise.resolve({ error: e.error });
    }
}
