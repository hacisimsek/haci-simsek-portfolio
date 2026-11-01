import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

// Serves the shared feed fixtures so e2e builds never reach GitHub, Medium or
// the radar's sources.
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
  // The radar's sources (lib/feeds/radar.ts, RADAR_FIXTURE_URL).
  ...Object.fromEntries(
    ['github', 'hn', 'hf', 'devto', 'lobsters'].map((name) => [
      `/radar/${name}`,
      {
        type: 'application/json',
        body: readFileSync(new URL(`radar/${name}.json`, fixtures)),
      },
    ])
  ),
  '/radar/simon': {
    type: 'application/atom+xml; charset=utf-8',
    body: readFileSync(new URL('radar/simon.xml', fixtures)),
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
