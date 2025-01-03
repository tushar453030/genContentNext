import { geminiModel, getYouTubeTranscript } from '@/lib/utils'
import axios from 'axios'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 86400 }) // 1 day TTL in seconds

export async function GET(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  const cachedResponse = cache.get(url)
  if (cachedResponse) {
    console.log('Cache hit!')
    return new Response(JSON.stringify({ response: cachedResponse }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const options = {
    method: 'POST',
    url: 'https://video-transcript-scraper.p.rapidapi.com/',
    headers: {
      'x-rapidapi-key': process.env.SCRAPE_API_KEY,
      'x-rapidapi-host': 'video-transcript-scraper.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      video_url: url,
      language: 'en',
    },
  }

  let response
  let transcriptString
  try {
    response = await axios.request(options)
    console.log(response.data)
    const transcriptArray = response.data.transcript // Assuming this is the array
    transcriptString = transcriptArray.map((item) => item.text).join('\n')
    transcriptString +=
      'Include this Video Url in your response at the end' + url + '/n'
  } catch (error) {
    console.error(error)
  }

  const prompt = `
    Act as a user who created a video on youtube now create a blog on it and don't include placeholder in the response. The word limit must be below 500. Use the below transcript to know the content about the video and then frame your response:
    Transcript: ${transcriptString}
    `
  const result = await geminiModel.generateContent(prompt)
  response = result.response.text()
  console.log(response)

  cache.set(url, response)

  return new Response(JSON.stringify({ response: response }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
