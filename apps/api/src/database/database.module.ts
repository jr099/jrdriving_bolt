import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { DRIZZLE_CLIENT } from './database.constants';
import * as schema from './schema';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) {
          throw new Error('DATABASE_URL must be set');
        }

        let normalizedUrl = url;
        if (/planetscale/i.test(url) || /\.psdb\.cloud/i.test(url)) {
          if (!url.includes('sslaccept=')) {
            normalizedUrl += url.includes('?') ? '&sslaccept=strict' : '?sslaccept=strict';
          }
        }

        const pool = mysql.createPool(normalizedUrl);
        return drizzle(pool, { schema });
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService, DRIZZLE_CLIENT, schema],
})
export class DatabaseModule {}

export { schema };
