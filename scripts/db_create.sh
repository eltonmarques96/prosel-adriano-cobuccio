#!/bin/sh

# Variáveis de ambiente
DB_HOST=${DB_HOST:-0.0.0.0}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-root}
DB_NAME=${DB_NAME:-prosel-adriano-cobuccio}

# Exporta a senha para o psql usar
export PGPASSWORD=$DB_PASSWORD

echo "Esperando o banco iniciar em $DB_HOST:$DB_PORT..."

# Aguarda conexão com o banco
until psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c '\q' 2>/dev/null; do
  echo "Aguardando conexão com o banco..."
  sleep 2
done

# Verifica se o banco existe
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")

if [ "$DB_EXISTS" = "1" ]; then
  echo "✅ Banco '${DB_NAME}' já existe. Nada a fazer."
else
  echo "🚀 Banco '${DB_NAME}' não existe. Criando..."
  createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
  echo "✅ Banco '${DB_NAME}' criado com sucesso."
fi
