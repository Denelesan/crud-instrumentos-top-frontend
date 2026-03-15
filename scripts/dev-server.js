#!/usr/bin/env node

/**
 * Script para iniciar el servidor de desarrollo de React
 * Ejecuta: node scripts/dev-server.js o npm start
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('  Iniciando Servidor de Desarrollo');
console.log('  CRUD Instrumentos Top - Frontend');
console.log('========================================\n');

// Cambiar al directorio del proyecto
process.chdir(path.join(__dirname, '..'));

// Configurar variables de entorno
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
process.env.BROWSER = 'none'; // No abre navegador automáticamente

console.log('Variables de entorno configuradas:');
console.log('- REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('- Puerto: 3000\n');

// Ejecutar npm start
const npmStart = spawn('npm', ['start'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
});

npmStart.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});

npmStart.on('close', (code) => {
  console.log('Servidor finalizado con código:', code);
  process.exit(code);
});

// Manejar señales de interrupción
process.on('SIGINT', () => {
  console.log('\n\nServidor detenido por el usuario');
  npmStart.kill();
  process.exit(0);
});
