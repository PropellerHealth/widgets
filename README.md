Collection of embeddable widgets for built in React.

Leverages [create-react-app](https://github.com/facebookincubator/create-react-app).

Server strategy heavily influenced by [ssr-create-react-app-v2](https://github.com/ayroblu/ssr-create-react-app-v2) and https://jobs.zalando.com/tech/blog/keeping-the-dom-neat-in-a-react-isomorphic-app/.

To run just the React front end, use `npm run start`, visit http://localhost:3000/asthma-conditions

To run it with the express server, run `npm run build && npm run start:server`.
Visit http://localhost:3002/asthma-conditions (or specify a different port via `PORT=5000`)
This will serve up a production build of the React code and will not live compile and reload.

For a production setting, run `npm run build && PORT=5005 NODE_ENV=production node ./server` (PORT defaults to 3002)
Visit http://localhost:3002/asthma-conditions (or whatever PORT you specified)


