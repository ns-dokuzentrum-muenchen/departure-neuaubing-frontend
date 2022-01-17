
import { Handler } from '@netlify/functions'

const PW = process.env.ACCESS_PW
const DEV = process.env.NETLIFY_DEV

const handler: Handler = async (event) => {
  const { password } = JSON.parse(event.body)

  const headers = {
    'Content-Type': 'application/json'
  }

  if (DEV) {
    headers['Access-Control-Allow-Origin'] = '*'
  }

  if (!password || !PW || password !== PW) {
    return {
      headers,
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    }
  }

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  }
}

export { handler }
