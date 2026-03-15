#!/bin/bash

# Script para iniciar el servidor de desarrollo de React
cd /vercel/share/v0-project

echo "Instalando dependencias si es necesario..."
npm install

echo "Iniciando servidor de desarrollo..."
npm start
