import { App } from '@slack/bolt';
import { addAssigneesToTask, createTask } from './api/tasks';
import { Assignee } from './model/Assignee';
import { getUserInfoById } from './commandUtils/userInfomation';
import { OperationType, parseTaskCommand } from './commandUtils/parseCommand';

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.OAUTH_TOKEN
});

/* Add functionality here */
app.message(':wave:', async ({ message, say }) => {
    if ('user' in message) {
        await say(`Hello, <@${message.user}>`);
    }
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
                await say(`Success ! here is the task ${result.task?.name}`);
            } else {
                await say('Task creation unsuccessful');
            }
            break;
        }
        case 'add-assignee': {
            let result = await addAssigneesToTask(parsedResult.nameOfTheTask, command.team_id, assignees);
            if (result.task) {
                await say(`Success ! We added new assignees to ${result.task?.name}`);
            } else {
                await say('Adding new assignees are not successfull');
            }
            break;
        }
        case 'delete': {
            break;
        }
        default: {
            break;
        }
        }
    } catch (e) {
        await say('It looks like you didnt pass enough parameters, try /task help');
    }
});

(async () => {
    // Start the app
    // @ts-ignore
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
