import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  target: 'node18.12',
  clean: true,
  dts: true,
  platform: 'neutral',
})
