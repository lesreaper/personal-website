import http from "node:http";
import { createReadStream, existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  fileURLToPath(new URL("../dist/client/", import.meta.url)),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
function regular(file) {
  try {
    return existsSync(file) && statSync(file).isFile();
  } catch {
    return false;
  }
}
export function resolveFile(route, directory = root) {
  if (!route.startsWith("/") || route.includes("\0") || route.includes("\\"))
    return null;
  const file = path.resolve(directory, `.${route}`);
  if (file !== directory && !file.startsWith(directory + path.sep)) return null;
  if (route.split("/").some((segment) => segment.startsWith("."))) return null;
  const candidate = [file, path.join(file, "index.html"), file + ".html"].find(
    regular,
  );
  if (!candidate) return null;
  const resolved = realpathSync(candidate);
  const resolvedRoot = realpathSync(directory);
  return resolved.startsWith(resolvedRoot + path.sep) ? candidate : null;
}
const legacy = {
  "/february-and-march-lancaster-ai-meetup-fun": "/speaking",
  "/february-and-march-lancaster-ai-meetup-fun/": "/speaking",
};
export function createStaticServer() {
  return http.createServer((request, response) => {
    const authority = request.headers.host ?? "localhost";
    if (authority.split(":")[0].toLowerCase() === "www.richardeverts.com") {
      response.writeHead(308, {
        Location: `https://richardeverts.com${request.url ?? "/"}`,
      });
      response.end();
      return;
    }
    let pathname;
    let url;
    try {
      url = new URL(request.url ?? "/", "http://localhost");
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400);
      response.end("Bad request");
      return;
    }
    if (pathname.includes("\0") || pathname.includes("\\")) {
      response.writeHead(400);
      response.end("Bad request");
      return;
    }
    if (!["GET", "HEAD"].includes(request.method ?? "GET")) {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }
    if (legacy[pathname]) {
      response.writeHead(308, { Location: legacy[pathname] + url.search });
      response.end();
      return;
    }
    const target = resolveFile(pathname);
    const fallback = [
      path.join(root, "404.html"),
      path.join(root, "404/index.html"),
    ].find(regular);
    const file = target ?? fallback;
    const status = target ? 200 : 404;
    if (!file) {
      response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end("Page not found");
      return;
    }
    const headers = {
      "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
      "Content-Length": statSync(file).size,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": /\/assets\/|\/_next\/|\/_vinext\//.test(pathname)
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate",
      ...(pathname.endsWith("Resume.pdf")
        ? {
            "Content-Disposition":
              'inline; filename="Richard-Everts-Resume.pdf"',
          }
        : {}),
    };
    if (request.method === "HEAD") {
      response.writeHead(status, headers);
      response.end();
      return;
    }
    const stream = createReadStream(file);
    stream.once("open", () => {
      response.writeHead(status, headers);
      stream.pipe(response);
    });
    stream.once("error", () => {
      if (!response.headersSent)
        response.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
      response.end("Unable to read this page");
    });
    response.once("close", () => stream.destroy());
  });
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const flag = (name) => {
    const index = process.argv.indexOf(name);
    return index < 0 ? undefined : process.argv[index + 1];
  };
  const port = Number(flag("--port") ?? process.env.PORT ?? 4173);
  const host = flag("--host") ?? process.env.HOST ?? "0.0.0.0";
  if (!Number.isInteger(port) || port < 0 || port > 65535)
    throw new Error("PORT must be an integer from 0 to 65535.");
  if (!existsSync(root))
    throw new Error("Build dist/client before starting the production server.");
  const server = createStaticServer();
  server.listen(port, host, () => console.log(`Local: http://${host}:${port}`));
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () => server.close(() => process.exit(0)));
}
