import { App } from '@slack/bolt';
import { addAssigneesToTask, createTask, getNextAssignee, removeAssigneesFromTask, removeTask } from './api/tasks';
import { Assignee } from './model/Assignee';
import { getUserInfoById } from './commandUtils/userInfomation';
import { parseTaskCommand } from './commandUtils/parseCommand';
import {
    addAssigneeSuccess, addAssigneeUnSuccess,
    createTaskSuccess,
    createTaskUnSuccess,
    helpBlock, nextSuccess, nextUnSuccess, removeAssigneeSuccess, removeAssigneeUnSuccess,
    removeTaskSuccess,
    removeTaskUnsuccess, wrongUsage
} from './slackBlocks';

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.OAUTH_TOKEN
});

app.command('/task', async ({ command, ack, say, client }) => {
    // Acknowledge command request
    await ack();

    try {
        let assignees: Array<Assignee> = [];
        const parsedResult = await parseTaskCommand(command.text);

        if ((parsedResult.users && parsedResult.users.length > 0)) {
            assignees = (await Promise.all(parsedResult.users.map(async (userInfo) => await getUserInfoById(userInfo, client)))).filter((a): a is Assignee => !!a);
        }

        switch (parsedResult.operation) {
        case 'create': {
            let result = await createTask(parsedResult.nameOfTheTask, command.team_id, assignees);
            if (result.task) {
                await say({ blocks: createTaskSuccess(result.task?.name) });
            } else {
                await client.chat.postEphemeral({
                    channel: command.channel_id,
                    user: command.user_id,
                    blocks: createTaskUnSuccess
                });
            }
            break;
        }
        case 'remove': {
            let result = await removeTask(parsedResult.nameOfTheTask);
            if (result.message) {
                await say({ blocks: removeTaskSuccess(parsedResult.nameOfTheTask) });
            } else {
                await client.chat.postEphemeral({
                    channel: command.channel_id,
                    user: command.user_id,
                    blocks: removeTaskUnsuccess(parsedResult.nameOfTheTask)
                });
            }
            break;
        }
        case 'add-assignee': {
            let result = await addAssigneesToTask(parsedResult.nameOfTheTask, command.team_id, assignees);
            let assigneesMessage:string = '';

            if (result.task) {
                assignees.forEach((assignee, index) => {
                    assigneesMessage += `<@${assignee.slackId}>`;
                });
                await say({ blocks: addAssigneeSuccess(parsedResult.nameOfTheTask, assigneesMessage) });
            } else {
                await client.chat.postEphemeral({
                    channel: command.channel_id,
                    user: command.user_id,
                    blocks: addAssigneeUnSuccess(parsedResult.nameOfTheTask)
                });
            }
            break;
        }
        case 'remove-assignee': {
            let result = await removeAssigneesFromTask(parsedResult.nameOfTheTask, command.team_id, assignees);
            let assigneesMessage:string = '';

            if (result.task) {
                assignees.forEach((assignee, index) => {
                    assigneesMessage += `<@${assignee.slackId}>`;
                });
                await say({ blocks: removeAssigneeSuccess(parsedResult.nameOfTheTask, assigneesMessage) });
            } else {
                await client.chat.postEphemeral({
                    channel: command.channel_id,
                    user: command.user_id,
                    blocks: removeAssigneeUnSuccess(parsedResult.nameOfTheTask)
                });
            }
            break;
        }
        case 'next': {
            let result = await getNextAssignee(parsedResult.nameOfTheTask, command.team_id);
            if (result.assignee) {
                await say({ blocks: nextSuccess(parsedResult.nameOfTheTask, result.assignee.slackId) });
            } else {
                await client.chat.postEphemeral({
                    channel: command.channel_id,
                    user: command.user_id,
                    blocks: nextUnSuccess(parsedResult.nameOfTheTask)
                });
            }
            break;
        }
        case 'help': {
            await say({
                blocks: helpBlock
            });
            break;
        }
        default: {
            break;
        }
        }
    } catch (e) {
        await say({ blocks: wrongUsage });
    }
});

(async () => {
    // Start the app
    // @ts-ignore
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
