import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

async function run() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('Por favor, defina a variável de ambiente DATABASE_URL.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  });

  try {
    await client.connect();
    console.log('✅ Conectado com sucesso ao PostgreSQL do Supabase!');

    const sqlPath = path.resolve(process.cwd(), 'supabase', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Aplicando migrations do schema.sql...');
    await client.query(sql);
    console.log('🎉 Migrations aplicadas com sucesso!');

    const res = await client.query('SELECT count(*) FROM public.studios');
    console.log(`Total de academias cadastradas: ${res.rows[0].count}`);
  } catch (err) {
    console.error('Erro na migration:', err);
  } finally {
    await client.end();
  }
}

run();
