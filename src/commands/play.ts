/* eslint-disable @stylistic/max-len */
import { Player, QueryType } from 'discord-player'
import { CommandInteraction, GuildMember } from 'discord.js'

export async function execute(interaction: CommandInteraction &
  { member: GuildMember }, player: Player) {
  try {
    const voiceChannel = interaction.member.voice.channel
    if (!voiceChannel) {
      interaction.reply({
        content: '⚠️ You need to be in a voice channel to use this command!',
        ephemeral: true,
      })
      return
    }
    const channel = interaction.channel
    if (!channel) {
      interaction.reply({
        content: '���️ Could not find the channel to play music!',
        ephemeral: true,
      })
      return
    }

    await interaction.deferReply()

    const query = interaction.options.get('song', true)?.value as string

    const searchResult = await player
      .search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE,
      })
      .catch((e) => console.log(e))

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.followUp({ content: 'No results were found!' })
    }

    const track = searchResult.tracks[0]
    const queue = player.nodes.create(interaction.guild!.id, {
      metadata: interaction.channel,
    })

    try {
      if (!queue.connection) {
        await queue.connect(voiceChannel)
      }
    } catch {
      player.nodes.delete(interaction.guild!.id)
      interaction.followUp({ content: 'Could not join your voice channel!' })
    }

    queue.addTrack(track)
    if (!queue.isPlaying()) await queue.node.play()

    await interaction.followUp({
      content: `✨ **Now Playing**\n\n🎵 **Song:** \`${track.title}\`\n\n⏳ **Duration:** \`${track.duration}\`\n\n🎤 **Artist:** \`${track.author}\`\n\n🌐 **Listen Here:** [Click Here](${track.url})`,
    })
  } catch (e) {
    console.log('Error executing:' + e)
    await interaction.followUp(
      {
        content: '❌ An error occurred while processing your request.',
      },
    )
  }
}
