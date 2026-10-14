import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

// Serves the shared feed fixtures so e2e builds never reach GitHub or Medium.
const fixtures = new URL('../fixtures/', import.meta.url);
const routes = {
  '/users/hacisimsek/repos': {
    type: 'application/json',
    body: readFileSync(new URL('github-repos.json', fixtures)),
  },
  '/feed/@hacisimsek': {
    type: 'application/rss+xml; charset=utf-8',
    body: readFileSync(new URL('medium-feed.xml', fixtures)),
  },
};

const port = Number(process.env.FEED_SERVER_PORT ?? 3101);

createServer((request, response) => {
  const { pathname } = new URL(request.url, `http://localhost:${port}`);
  const route = routes[pathname];
  if (!route) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': route.type }).end(route.body);
}).listen(port, () => {
  console.log(`Feed fixture server on http://localhost:${port}`);
});
