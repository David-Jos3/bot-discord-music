import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import ollama from 'ollama'

export async function responseaOllama(
  question: string, messageCreate: OmitPartialGroupDMChannel<Message>) {
  try {
    const typingInterval = setInterval(() => {
      messageCreate.channel.sendTyping()
    }, 5000)
    const message = { role: 'user', content: question }
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [message],
      stream: true,
    })
    let accumulatedMessage = ''

    for await (const part of response) {
      accumulatedMessage += part.message.content

      if (accumulatedMessage.length > 2000) {
        await messageCreate.reply(accumulatedMessage.slice(0, 2000))
        accumulatedMessage = accumulatedMessage.slice(2000)
      }
    }
    if (accumulatedMessage.length > 0) {
      await messageCreate.reply(accumulatedMessage)
    }
    clearInterval(typingInterval)
  } catch (e) {
    console.log(e)
  }
}
