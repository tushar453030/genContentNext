import { getYouTubeTranscript } from '@/lib/utils'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  console.log(url)

  const transcript = await getYouTubeTranscript(url)

  return new Response(JSON.stringify({ transcript }))
}
