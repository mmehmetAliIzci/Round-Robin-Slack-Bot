export type OperationType = 'create' | 'remove' | 'add-assignee' | 'remove-assignee' | 'next' | 'help' | '';

export interface ParsedCommand {
    operation: OperationType,
    nameOfTheTask: string,
    users?: Array<string>
}
const allowedOperations: Array<string> = ['create', 'remove', 'add-assignee', 'remove-assignee', 'next'];
const allowedSingleOperations: Array<string> = ['help'];

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
    } else if (commands.length === 1) {
        response.operation = (allowedSingleOperations.find((command) => command === commands[0].toLowerCase()) ?? '') as OperationType;
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error('Not enough parameters'));
    }
}
