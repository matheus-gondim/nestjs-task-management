import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: config.get('database.type'),
  host: config.get('database.host'),
  port: config.get('database.port'),
  username: config.get('database.username'),
  password: config.get('database.password'),
  database: config.get('database.namedb'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
    ca: readFileSync(config.get('database.ssl_ca')).toString(),
  },
};
