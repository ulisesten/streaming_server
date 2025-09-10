#!/bin/bash

echo "Instalando dependencias..."
npm install

echo "Compilando módulo nativo..."
npm run build

echo "Creando directorios necesarios..."
mkdir -p videos public/js public/css

echo "Iniciando servidor..."
npm start