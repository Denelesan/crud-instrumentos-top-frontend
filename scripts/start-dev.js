#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('[v0] Iniciando servidor de desarrollo...');
console.log('[v0] Proyecto: CRUD Instrumentos Top Frontend');
console.log('[v0] Framework: React with Create React App');
console.log('[v0] Esperando conexión en puerto 3000...\n');

const projectRoot = path.join(__dirname, '..');

const env = {
  ...process.env,
  BROWSER: 'none', // Evita abrir navegador automáticamente
  PORT: process.env.PORT || 3000,
};

const devServer = spawn('npm', ['start'], {
  cwd: projectRoot,
  env: env,
  stdio: 'inherit',
});

devServer.on('error', (error) => {
  console.error('[v0] Error al iniciar el servidor:', error);
  process.exit(1);
});

devServer.on('close', (code) => {
  console.log('[v0] Servidor cerrado con código:', code);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('\n[v0] Deteniendo servidor...');
  devServer.kill();
  process.exit(0);
});
