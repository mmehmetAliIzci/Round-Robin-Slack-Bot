import fetch from 'node-fetch';
import { Assignee } from '../model/Assignee';
import { Task } from '../model/Task';

export async function createTask (name: string, ownerTeamId: string, people?: Assignee[], url?: string): Promise<{ task?: Task; error?: string }> {
    const URL = url ?? `${process.env.BE_BASE_URL}/task/add`;
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

export async function removeTask (name: string): Promise<{message?: string, error?: string}> {
    const URL = `${process.env.BE_BASE_URL}/task/remove`;
    let body: { name: string} = {
        name
    };
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const res: { message: string } = await response.json();
            return Promise.resolve({ message: res.message });
        }
        return Promise.resolve({ error: 'Something went wrong' });
    } catch (e) {
        return Promise.resolve({ error: e.error });
    }
}

export async function addAssigneesToTask (taskName: string, ownerTeamId: string, people: Assignee[]): Promise<{ task?: Task; error?: string }> {
    return createTask(taskName, ownerTeamId, people, `${process.env.BE_BASE_URL}/task/add-assignee`);
}

export async function removeAssigneesFromTask (taskName: string, ownerTeamId: string, people: Assignee[]): Promise<{ task?: Task; error?: string }> {
    return createTask(taskName, ownerTeamId, people, `${process.env.BE_BASE_URL}/task/remove-assignee`);
}

export async function getNextAssignee (name: string, ownerTeamId: string): Promise<{ assignee?: Assignee; error?: string }> {
    const URL = `${process.env.BE_BASE_URL}/task/next-assignee`;
    let body: { name: string, ownerTeamId: string } = {
        name,
        ownerTeamId: ownerTeamId
    };
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const res: { message: string, assignee: Assignee } = await response.json();
            return Promise.resolve({ assignee: res.assignee });
        }
        return Promise.resolve({ error: 'Something went wrong' });
    } catch (e) {
        return Promise.resolve({ error: e.error });
    }
}
