import z from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  YOUTUBE_API_KEY: z.string(),
  CLIENT_ID: z.string(),
  CHANNEL_ID: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.error) {
  throw new Error(`Invalid environment variables: ${_env.error.message}`)
}

export const env = _env.data
