import { env } from './env/env'
import {
  Client,
  CommandInteraction,
  GatewayIntentBits,
  GuildMember,
} from 'discord.js'
import { ready } from './events/ready'
import { Player } from 'discord-player'
import { YoutubeiExtractor } from 'discord-player-youtubei'
import { registerCommands } from './scripts/registerCommands'
import { execute } from './commands/play'
import { skip } from './commands/skip'
import { pause } from './commands/pause'

registerCommands()

const client = new Client(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ],
  })
const player = new Player(client, {
  ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1 << 25,
  },
})
player.extractors.register(YoutubeiExtractor, {})
client.on('ready', ready)

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'play') {
    await execute(interaction as CommandInteraction &
      { member: GuildMember }, player)
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'skip') {
    await skip(interaction as CommandInteraction &
      { member: GuildMember }, player)
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'pause') {
    await pause(interaction as CommandInteraction &
      { member: GuildMember }, player)
  }
})

client.login(env.DISCORD_TOKEN)
