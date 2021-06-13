# WIP Round robin slack bot

For the longest time, teams suffered to determine who will be the next person to:

- Take notes in a meeting
- Initiate stand-ups
- Be the sole responsible for taking care of the tickets this week
- Put the dishes 
- Take out the trash
...

Thus, I wanted to implement my Excel sheet free round-robin system where people can:

- [ ] create tasks
- [ ] delete tasks
- [ ] rename tasks
- [ ] assign single person to task
- [ ] assign multiple people to task
- [ ] un-assign single person from task
- [ ] un-assign multiple people from task
- [ ] Ask RoundRobin bot who will be the next person of the task

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

TBD