const jsonServer = require('json-server');
const longPollingMiddleware = require('./middleware');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Apply the long-polling middleware

// Use the router (handles POST, PUT, DELETE, and GET requests)
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
