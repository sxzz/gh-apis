import process from 'node:process'

if (!process.env.VITE_GITHUB_SESSION) {
  throw new Error('VITE_GITHUB_SESSION is required for tests')
}
