import { Handler } from '@netlify/functions'
import axios from 'axios'

const handler: Handler = async (event) => {
  const id = event.queryStringParameters['id']

  const headers = {
    'Content-Type': 'application/json'
  }

  if (process.env.NETLIFY_DEV) {
    headers['Access-Control-Allow-Origin'] = '*'
  }

  if (!id) {
    return {
      headers,
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' })
    }
  }

  try {
    const VIMEO_KEY = process.env.VIMEO_KEY
    const { data } = await axios.get(`https://api.vimeo.com/videos/${id}/texttracks`, {
      headers: {
        'Authorization': `Bearer ${VIMEO_KEY}`
      }
    })

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (err) {
    return {
      headers,
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    }
  }
}

export { handler }
