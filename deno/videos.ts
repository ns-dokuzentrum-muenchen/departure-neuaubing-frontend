import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

function handler(req: Request): Response {
  const url = new URL(req.url)
  const video = url.searchParams.get('v')

  if (!video || !video.includes('oauth_token_id')) {
    return new Response('Not found', {
      status: 404,
      statusText: 'Not found'
    })
  }

  const vimeoUrl = 'https://player.vimeo.com/external/' + video
  return fetch(vimeoUrl, {
    mode: 'cors',
    headers: {
      'origin': 'https://departure-neuaubing.nsdoku.de',
      'referer': 'https://departure-neuaubing.nsdoku.de/'
    }
  })
}

await serve(handler);

// deployed to dn-videos.deno.dev
