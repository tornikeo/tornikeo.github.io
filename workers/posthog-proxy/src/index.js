const API_HOST = "us.i.posthog.com";
const ASSET_HOST = "us-assets.i.posthog.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400"
};

async function handleRequest(request, ctx) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const pathWithParams = url.pathname + url.search;
  const response =
    url.pathname.startsWith("/static/") || url.pathname.startsWith("/array/")
      ? await retrieveAsset(request, pathWithParams, ctx)
      : await forwardRequest(request, pathWithParams);

  return addCorsHeaders(response);
}

async function retrieveAsset(request, pathWithParams, ctx) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return fetch(`https://${ASSET_HOST}${pathWithParams}`, {
      method: request.method,
      headers: request.headers,
      body: await request.arrayBuffer(),
      redirect: request.redirect
    });
  }

  let response = await caches.default.match(request);
  if (!response) {
    response = await fetch(`https://${ASSET_HOST}${pathWithParams}`);
    if (response.ok) {
      ctx.waitUntil(caches.default.put(request, response.clone()));
    }
  }

  return response;
}

async function forwardRequest(request, pathWithParams) {
  const originHeaders = new Headers(request.headers);
  const ip = request.headers.get("CF-Connecting-IP") || "";

  originHeaders.delete("cookie");
  originHeaders.set("X-Forwarded-For", ip);

  return fetch(
    new Request(`https://${API_HOST}${pathWithParams}`, {
      method: request.method,
      headers: originHeaders,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.arrayBuffer()
          : null,
      redirect: request.redirect
    })
  );
}

function addCorsHeaders(response) {
  const headers = new Headers(response.headers);

  for (const [header, value] of Object.entries(CORS_HEADERS)) {
    headers.set(header, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, ctx);
  }
};
