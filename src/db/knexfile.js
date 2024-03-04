import { config } from 'dotenv';
import path from 'path';

config();

// Define a function to resolve the migrations' directory path
const resolveMigrationPath = (dir) => {
  return path.resolve(__dirname, dir);
};

const knexConfig = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT || 5433,
      user: String(process.env.PG_USER),
      password: String(process.env.PG_PASSWORD),
      database: process.env.PG_DB,
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      ssl: { rejectUnauthorized: false },
    }
  }

};

export default knexConfig;
