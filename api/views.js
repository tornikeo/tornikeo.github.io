import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Sanitize slug to prevent injection
  const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_/]/g, '');
  const key = `pageviews:${sanitizedSlug}`;

  try {
    // Increment and get the new count
    const views = await kv.incr(key);

    return new Response(JSON.stringify({ views }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('KV Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update views' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
