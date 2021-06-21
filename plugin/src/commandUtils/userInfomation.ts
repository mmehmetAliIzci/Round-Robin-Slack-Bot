import { WebClient } from '@slack/web-api';
import { Assignee } from '../model/Assignee';

export async function getUserInfoById (userId: string, client: WebClient): Promise<undefined | Assignee> {
    let result = /(?<=@)(.*?)(?=\|)/.exec(userId);
    if (result && result.length > 0) {
        let userId = result[0];
        try {
            // Call the users.info method using the WebClient
            const user = await client.users.info({
                user: userId
            });
            return Promise.resolve({
                slackId: userId,
                name: user.user?.name ?? '',
                teamId: user.user?.team_id ?? '',
                isBot: user.user?.is_bot ?? false
            });
        } catch (error) {
            return Promise.resolve(undefined);
        }
    }
    return Promise.resolve(undefined);
}
