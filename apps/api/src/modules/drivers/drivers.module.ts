import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { MissionsModule } from '../missions/missions.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MissionsModule, AuthModule],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
