import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import http from "node:http";
import { createStaticServer } from "./serve.mjs";

test("development is excluded from indexing; production remains crawlable", async () => {
  const previous = process.env.SITE_ENVIRONMENT;
  const server = createStaticServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    process.env.SITE_ENVIRONMENT = "development";
    const home = await fetch(origin);
    assert.equal(home.status, 200);
    assert.equal(
      home.headers.get("x-robots-tag"),
      "noindex, nofollow, noarchive",
    );
    const robots = await fetch(origin + "/robots.txt");
    assert.equal(await robots.text(), "User-agent: *\nDisallow: /\n");
    assert.match(robots.headers.get("cache-control"), /no-store/);
    const missing = await fetch(origin + "/private-source");
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get("x-robots-tag"), /noindex/);
    delete process.env.SITE_ENVIRONMENT;
    assert.equal((await fetch(origin)).headers.get("x-robots-tag"), null);
    assert.doesNotMatch(
      await (await fetch(origin + "/robots.txt")).text(),
      /Disallow: \/\s*$/m,
    );
    for (const retired of [
      "/resume",
      "/resume/",
      "/resume.html",
      "/resume/index.html",
      "/resume.md",
      "/Richard-Everts-Resume.pdf",
    ]) {
      const result = await fetch(origin + retired);
      assert.equal(result.status, 410, retired);
      assert.match(result.headers.get("cache-control"), /no-store/);
      assert.match(result.headers.get("x-robots-tag"), /noindex/);
      assert.ok(!(await result.text()).startsWith("%PDF"));
    }
    for (const alias of ["/talks", "/talks/"]) {
      const response = await fetch(origin + alias + "?from=archive", {
        redirect: "manual",
      });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), "/speaking?from=archive");
    }
    const head = await fetch(origin + "/Richard-Everts-Resume.pdf", {
      method: "HEAD",
    });
    assert.equal(head.status, 410);
    assert.equal(await head.text(), "");
    const redirect = await new Promise((resolve, reject) => {
      http
        .get(
          origin + "/research?q=SIML",
          { headers: { Host: "www.richeverts.com" } },
          (response) => {
            response.resume();
            resolve({
              status: response.statusCode,
              location: response.headers.location,
            });
          },
        )
        .on("error", reject);
    });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.location, "https://richeverts.com/research?q=SIML");
  } finally {
    if (previous === undefined) delete process.env.SITE_ENVIRONMENT;
    else process.env.SITE_ENVIRONMENT = previous;
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("a reader can reconstruct the public record by following llms.txt links over HTTP", async (t) => {
  const server = createStaticServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = "http://127.0.0.1:" + server.address().port;
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });
  const index = await fetch(origin + "/llms.txt");
  assert.equal(index.status, 200);
  const contents = await index.text();
  const urls = [
    ...contents.matchAll(/\]\((https:\/\/richeverts\.com\/[^\s)]+)\)/g),
  ].map((match) => new URL(match[1]).pathname);
  async function readLinked(path) {
    assert.ok(urls.includes(path), "Missing discovery link " + path);
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    return response.text();
  }
  const declaration = await readLinked(
    "/writing/declaration-of-terran-liberty.md",
  );
  assert.match(
    declaration,
    /Publicly released December 21, 2012, at TerranLiberty\.org/,
  );
  assert.match(declaration, /Authors: Richard Everts/);
  const research = await readLinked("/research.md");
  assert.match(research, /RTX 3060/);
  assert.match(research, /12\.08/);
  assert.match(research, /0\.871/);
  assert.match(research, /peer review/i);
  const study = await readLinked("/research/gpu-lattice-updates.md");
  assert.match(
    study,
    /https:\/\/www\.siml\.life\/research\/siml-gpu-capability/,
  );
  const psychic = await readLinked("/work/psychic-unicorn.md");
  assert.match(psychic, /Credit: Founder and lead AI engineer/);
  assert.match(psychic, /https:\/\/psychicunicorn\.com/);
  const archive = await readLinked("/archive.md");
  const harmonics = [
    ...archive.matchAll(
      /^\d+\. \[[^\]]+\]\((https:\/\/github\.com\/SIML-Life\/siml-codex\/blob\/[a-f0-9]+\/_Primary_Codex\/[^)]+)\)/gm,
    ),
  ];
  assert.equal(new Set(harmonics.map((match) => match[1])).size, 12);
  assert.match(archive, /Myth_Prompt\.md/);
  assert.match(contents, /Authored by: The Operator/);
  const profile = JSON.parse(await readLinked("/profile.json"));
  assert.ok(
    profile.authorship.some(
      (record) =>
        record.name === "The Operator" &&
        record.person === "Richard Everts" &&
        record.repository === "https://github.com/SIML-Life/siml-codex",
    ),
  );
});
