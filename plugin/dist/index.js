var createEventAdapter = require('@slack/events-api').createEventAdapter;
// Slack requires a secret key to run your bot code. We'll find and figure out this signing secret thing in the next steps
var slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
var port = process.env.PORT || 3000;
// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', function (event) {
    console.log("Received a message event: user " + event.user + " in channel " + event.channel + " says " + event.text);
});
// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);
// Start a basic HTTP server
slackEvents.start(port).then(function () {
    // Listening on path '/slack/events' by default
    console.log("server listening on port " + port);
});
//# sourceMappingURL=index.js.map