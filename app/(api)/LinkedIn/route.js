import { Innertube } from 'youtubei.js/web'

const fetchTranscript = async (url) => {
  const youtube = await Innertube.create({
    lang: 'en',
    location: 'US',
    retrieve_player: false,
  })

  try {
    const info = await youtube.getInfo(url)
    const transcriptData = await info.getTranscript()
    return transcriptData.transcript.content.body.initial_segments.map(
      (segment) => segment.snippet.text
    )
  } catch (error) {
    console.error('Error fetching transcript:', error)
    throw error
  }
}

async function getYouTubeTranscript(videoUrl) {
  const videoId = new URL(videoUrl).searchParams.get('v')
  const transcript = await fetchTranscript(videoId)
  return transcript?.join(' ')
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  console.log(url)

  const transcript = await getYouTubeTranscript(url)

  return new Response(JSON.stringify({ transcript }))
}

// export async function GET() {
//   return new Response('API route is working')
// }
