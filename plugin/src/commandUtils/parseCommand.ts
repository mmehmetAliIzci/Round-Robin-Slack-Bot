export type OperationType = 'create'| 'add-assignee' | 'remove-assignee' | 'next' |'delete' |'';

export interface ParsedCommand {
    operation: OperationType,
    nameOfTheTask: string,
    users?: Array<string>
}
const allowedOperations: Array<string> = ['create', 'add-assignee', 'remove-assignee', 'next', 'delete'];

export async function parseTaskCommand (text: string): Promise<ParsedCommand> {
    const commands = text.trim().split(/\s+/);
    let response: ParsedCommand = { operation: '', nameOfTheTask: '' };

    if (commands.length >= 2) {
        response.operation = (allowedOperations.find((command) => command === commands[0].toLowerCase()) ?? '') as OperationType;
        response.nameOfTheTask = commands[1];
        if (commands.length > 2) {
            response.users = commands.slice(1);
        }
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error('Not enough parameters'));
    }
}
