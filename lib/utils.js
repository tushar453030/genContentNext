import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai'

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
]

const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
console.log(process.env.GEMINI_API_KEY)
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 200,
}
const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
  safetySettings,
})

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

export { geminiModel, getYouTubeTranscript }
