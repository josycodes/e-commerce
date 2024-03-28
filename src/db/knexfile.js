import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config();

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
    migrations: {
      extension: 'cjs'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'ca-certificate-pp2.crt')) // Provide the path to your .crt file
      }
    }
  }
};

export default knexConfig;
