import { CommandInteraction, GuildMember } from 'discord.js'
import { Player } from 'discord-player'

export async function skip(interaction: CommandInteraction &
  { member: GuildMember }, player: Player) {
  try {
    if (interaction.commandName === 'skip') {
      await interaction.deferReply()
      const queue = player.nodes.get(interaction.guild!.id)

      if (!queue || !queue.isPlaying()) {
        return interaction.followUp(
          {
            content: '❌ | No music is being played!',
          })
      }
      const currentTrack = queue.tracks.data[0].title

      const success = queue.node.skip()
      return interaction.followUp({
        content: success
          ? `✅ | Skipped **${currentTrack}**!`
          : '❌ | Something went wrong!',
      })
    }
  } catch (e) {
    console.log('Error executing skip command:', e)
    await interaction.followUp({
      content: '�� | An error occurred while processing your request.',
    })
  }
}
