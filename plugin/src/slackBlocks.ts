export const helpBlock = [
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '\n\n'
        }
    },
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '*Tasks*'
        }
    },
    {
        type: 'section',
        fields: [
            {
                type: 'plain_text',
                text: ':heavy_plus_sign: :ledger: create OneWordTaskName',
                emoji: true
            },
            {
                type: 'plain_text',
                text: '/task create standup',
                emoji: true
            },
            {
                type: 'plain_text',
                text: ':heavy_minus_sign: :ledger: remove task',
                emoji: true
            },
            {
                type: 'plain_text',
                text: '/task remove standup',
                emoji: true
            }
        ]
    },
    {
        type: 'divider'
    },
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '*People*'
        }
    },
    {
        type: 'section',
        fields: [
            {
                type: 'plain_text',
                text: ':heavy_plus_sign: :astronaut: add assignees to task',
                emoji: true
            },
            {
                type: 'plain_text',
                text: '/task add-assignee standup @person',
                emoji: true
            },
            {
                type: 'plain_text',
                text: ':heavy_minus_sign: :astronaut: remove assignees from task',
                emoji: true
            },
            {
                type: 'plain_text',
                text: '/task remove-assignee standup @person',
                emoji: true
            },
            {
                type: 'plain_text',
                text: ':black_right_pointing_double_triangle_with_vertical_bar: :astronaut: assign next person',
                emoji: true
            },
            {
                type: 'plain_text',
                text: '/task next standup',
                emoji: true
            }
        ]
    }
];
