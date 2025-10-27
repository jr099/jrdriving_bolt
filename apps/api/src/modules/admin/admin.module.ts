import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MissionsModule } from '../missions/missions.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [DatabaseModule, AuthModule, MissionsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
