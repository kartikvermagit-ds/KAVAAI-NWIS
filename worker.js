export default {
  async fetch(request, env) {
    // Assets are automatically served by Cloudflare before reaching this fetch handler.
    // If an SPA route or non-file route is requested, serve index.html
    const url = new URL(request.url);
    if (!url.pathname.includes('.')) {
      const indexRequest = new Request(new URL('/', request.url), request);
      if (env.ASSETS) {
        return env.ASSETS.fetch(indexRequest);
      }
    }
    return new Response('Not Found', { status: 404 });
  }
};
