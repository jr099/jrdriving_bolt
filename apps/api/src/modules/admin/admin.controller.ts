import { Controller, Get, UseGuards } from '@nestjs/common';
import type { AdminDashboardResponse } from '@jrdriving/shared';
import { AdminService } from './admin.service';
import { CookieAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(CookieAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  @Roles('admin')
  getDashboard(): Promise<AdminDashboardResponse> {
    return this.admin.getDashboard();
  }
}
