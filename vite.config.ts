import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  base:'/sat-daily-practice/',
  plugins:[react()],
  test:{
    environment:'jsdom',
    setupFiles:'./src/test/setup.ts',
    css:true,
  },
})
