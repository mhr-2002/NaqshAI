import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Debug: Log all available environment variable keys
  console.log('Available process.env keys:', Object.keys(process.env).filter(k => !k.startsWith('npm_')));
  console.log('Available loadEnv keys:', Object.keys(env));
  
  const apiKey = env.GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 env['Gemini API Key'] || 
                 process.env['Gemini API Key'] ||
                 env.VITE_GEMINI_API_KEY || 
                 process.env.VITE_GEMINI_API_KEY ||
                 '';
  
  console.log('Final apiKey resolved to:', apiKey ? 'Value found' : 'EMPTY STRING');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
