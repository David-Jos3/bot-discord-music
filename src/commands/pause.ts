import { Player } from 'discord-player'
import { CommandInteraction, GuildMember } from 'discord.js'

export async function pause(
  interaction: CommandInteraction & { member: GuildMember },
  player: Player) {
  try {
    await interaction.deferReply()
    const queue = player.nodes.get(interaction.guild!.id)

    if (!queue || !queue.isPlaying()) {
      interaction.followUp({ content: '❌ | No music is being played!' })
      return
    }

    if (queue.node.isPaused()) {
      queue.node.setPaused(false)
      return interaction.followUp({ content: '▶️ | Resumed the player!' })
    } else {
      queue.node.setPaused(true)
      return interaction.followUp({ content: '⏸️  | Paused the player!' })
    }
  } catch (e) {
    console.log(e)
  }
}
