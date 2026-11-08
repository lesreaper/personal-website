import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import http from 'node:http';
import { createStaticServer } from './serve.mjs';

test('development is excluded from indexing; production remains crawlable', async () => {
  const previous = process.env.SITE_ENVIRONMENT;
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    process.env.SITE_ENVIRONMENT = 'development';
    const home = await fetch(origin);
    assert.equal(home.status, 200);
    assert.equal(home.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
    const robots = await fetch(origin + '/robots.txt');
    assert.equal(await robots.text(), 'User-agent: *\nDisallow: /\n');
    assert.match(robots.headers.get('cache-control'), /no-store/);
    const missing = await fetch(origin + '/private-source');
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get('x-robots-tag'), /noindex/);
    delete process.env.SITE_ENVIRONMENT;
    assert.equal((await fetch(origin)).headers.get('x-robots-tag'), null);
    assert.doesNotMatch(await (await fetch(origin + '/robots.txt')).text(), /Disallow: \/\s*$/m);
    const redirect = await new Promise((resolve, reject) => {
      http.get(origin + '/research?q=SIML', { headers: { Host: 'www.richeverts.com' } }, response => {
        response.resume();
        resolve({ status: response.statusCode, location: response.headers.location });
      }).on('error', reject);
    });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.location, 'https://richeverts.com/research?q=SIML');
  } finally {
    if (previous === undefined) delete process.env.SITE_ENVIRONMENT;
    else process.env.SITE_ENVIRONMENT = previous;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
