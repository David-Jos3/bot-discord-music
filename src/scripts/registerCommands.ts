import { ApplicationCommandOptionType, REST, Routes } from 'discord.js'
import { env } from '../env/env'
import { QueryType } from 'discord-player'

const commands = [
  {
    name: 'play',
    description: 'Toca uma música pelo nome ou URL',
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: 'song',
        type: ApplicationCommandOptionType.String,
        description: 'Nome ou URL da música que você deseja tocar',
        required: true,
      },
      {
        name: 'engine',
        type: ApplicationCommandOptionType.String,
        description: 'Tipo de consulta de música',
        choices: Object.values(QueryType).map(type => ({
          name: type,
          value: type,
        })),
      },
    ],
  },
  {
    name: 'skip',
    description: 'Pula para a próxima música na fila',
  },
  {
    name: 'pause',
    description: 'Pausa a música que está tocando',
  },
]

export async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN)

  try {
    console.log('Iniciando o registro dos comandos de barra...')
    await rest.put(
      Routes.applicationCommands(env.CLIENT_ID),
      { body: commands },
    )
    console.log('Comandos registrados com sucesso!')
  } catch (error) {
    console.error('Erro ao registrar comandos:', error)
  }
}
