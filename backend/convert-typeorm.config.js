/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const AppDataSource = require('./dist/src/database/typeorm.config').default;

// Função para buscar recursivamente arquivos .entity.js dentro da pasta dist
function findEntityFiles(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findEntityFiles(fullPath, fileList, baseDir);
    } else if (stat.isFile() && file.endsWith('.entity.js')) {
      const relativePath = path
        .relative(process.cwd(), fullPath)
        .split(path.sep)
        .join('/');
      fileList.push(relativePath);
    }
  });

  return fileList;
}

// Função para construir caminho das migrations JS (padrão fixo dentro de dist)
function buildMigrationsPath() {
  const migrationsDir = path.resolve(process.cwd(), 'dist/database/migrations');
  return [
    path.relative(process.cwd(), migrationsDir).split(path.sep).join('/') +
      '/*.{js,ts}',
  ];
}

function generateOrmConfig() {
  const baseConfig = AppDataSource.options;

  // Buscar entidades compiladas e definir no config
  const entities = findEntityFiles(path.resolve(process.cwd(), 'dist'));
  baseConfig.entities = entities;

  // Definir migrations compiladas no config
  baseConfig.migrations = buildMigrationsPath();

  const outputPath = path.resolve(process.cwd(), 'ormconfig.json');
  fs.writeFileSync(outputPath, JSON.stringify(baseConfig, null, 2));
  console.log(`Arquivo ormconfig.json gerado em: ${outputPath}`);
  console.log(`Foram encontradas ${entities.length} entidades.`);
}

generateOrmConfig();
