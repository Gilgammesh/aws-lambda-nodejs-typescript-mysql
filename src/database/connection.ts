import mysql, { Pool, PoolConfig } from 'mysql';

const poolConfig: PoolConfig = {
  connectionLimit: 10,
  debug: true,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 3306,
  database: process.env.DB_NAME || 'test',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

export const pool: Pool = mysql.createPool(poolConfig);
