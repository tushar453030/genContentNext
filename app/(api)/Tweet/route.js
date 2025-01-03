import { geminiModel, getYouTubeTranscript } from '@/lib/utils'
import axios from 'axios'

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
  console.log(url)

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
    Act as a user who created a video on youtube now create a tweet for Twitter. The character limit must be below 200 also add necessary hashtags at the end of the post and don't include placeholder in the response. Use the below transcript regarding the video to frame your response:
    Transcript: ${transcriptString}.
    `
  const result = await geminiModel.generateContent(prompt)
  response = result.response.text()
  console.log(response)

  return new Response(JSON.stringify({ response: response }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
