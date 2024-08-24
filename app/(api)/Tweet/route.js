import { geminiModel, getYouTubeTranscript } from '@/lib/utils'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  console.log(url)

  const transcript = await getYouTubeTranscript(url)

  const prompt = `
    Act as a user who created a video on youtube now create a tweet for Twitter. The character limit must be below 200 also add necessary hashtags at the end of the post. Use the below transcript to frame your response:
    Transcript: ${cleanedTranscript}
    `
  const result = await geminiModel.generateContent(prompt)
  const response = result.response.text()
  console.log(response)

  return new Response(JSON.stringify({ response }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
