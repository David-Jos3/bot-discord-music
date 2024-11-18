import { Client } from 'discord.js'
import { env } from '../env/env'

export async function ready(client: Client) {
  await client.channels.fetch(env.CHANNEL_ID)
  console.log(`Logged in as ${client.user?.tag}!`)
}
