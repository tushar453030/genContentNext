import { geminiModel, getYouTubeTranscript } from '@/lib/utils'

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

  const transcript = await getYouTubeTranscript(url)

  const prompt = `
  Act as a user who created a video on youtube now create a post for LinkedIn. The character limit must be below 1000 also add necessary hashtags at the end of the post. Use the below transcript to frame your response:
  Transcript: ${transcript}
  `
  const result = await geminiModel.generateContent(prompt)
  const response = result.response.text()
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
