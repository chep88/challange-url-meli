import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      username: process.env.DATA_USER,
      password: process.env.DATA_PASS,
      baseName: process.env.DATA_DBNAME,
      dataconection: process.env.DATA_CONNECTION,
      host: process.env.DATA_HOST,
      port: process.env.DATA_PORT,
    },
    apiKey: process.env.API_KEY,
  };
});
