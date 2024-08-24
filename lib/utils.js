import { GoogleGenerativeAI } from '@google/generative-ai'

const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
})

export { geminiModel }
