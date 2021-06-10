const { App } = require('@slack/bolt');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.OAUTH_TOKEN,
});

/* Add functionality here */
app.message(':wave:', async ({ message, say }) => {
    await say(`Hello, <@${message.user}>`);
});

(async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();