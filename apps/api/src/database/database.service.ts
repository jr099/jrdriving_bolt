import { Inject, Injectable } from '@nestjs/common';
import { type MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE_CLIENT } from './database.constants';
import * as schema from './schema';

export type Database = MySql2Database<typeof schema>;

@Injectable()
export class DatabaseService {
  constructor(@Inject(DRIZZLE_CLIENT) private readonly client: Database) {}

  get db() {
    return this.client;
  }
}
