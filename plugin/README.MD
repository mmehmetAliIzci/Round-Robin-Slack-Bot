# WIP Round robin slack bot

For the longest time, teams suffered to determine who will be the next person to:

- Take notes in a meeting
- Initiate stand-ups
- Be the sole responsible for taking care of the tickets this week
- Put the dishes 
- Take out the trash
...

Thus, I wanted to implement my Excel sheet free round-robin system where people can:

- [X] create tasks
- [X] delete tasks
- [ ] rename tasks (decided not to)
- [X] assign single person to task
- [X] assign multiple people to task
- [X] un-assign single person from task
- [X] un-assign multiple people from task
- [X] Ask RoundRobin bot who will be the next person of the task
- [ ] Add help command
- [ ] Beautify messages

Security

[ ] Disallow any request except slack
[ ] Allow only same team to change the tasks

For this we need 2 main things:

1) Slack application which will be responsible for sending requests to our BE
2) BE server who will be processing and replying with correct behaviour

Main schema will eventually look like

```json
Tasks
  - ID
  - name: string
  - people: string[]
  - ownerID: string
```

```json
People
  - name: string
  - ID: string
```

### TechStack

We only need a BE server with a DB. I choose to use MONGODB with express server.


### Challenges

#### What should happen if RoundRobin has only one user, which is the current assignee and next assignee has been asked ?

- Keep circling and ignore that next user is the current user 
- Throw error because there is only one person

#### How should you divide commands in slack ?
