import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../modules/auth/auth.module';
import { QuotesModule } from '../modules/quotes/quotes.module';
import { MissionsModule } from '../modules/missions/missions.module';
import { DriversModule } from '../modules/drivers/drivers.module';
import { AdminModule } from '../modules/admin/admin.module';
import configuration from '../config/configuration';
import { SessionsModule } from '../modules/sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    SessionsModule,
    AuthModule,
    QuotesModule,
    MissionsModule,
    DriversModule,
    AdminModule,
  ],
})
export class AppModule {}
