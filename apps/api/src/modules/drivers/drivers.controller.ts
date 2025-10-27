import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { DriverDashboardResponse } from '@jrdriving/shared';
import { DriversService } from './drivers.service';
import { CookieAuthGuard, RequestWithSession } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('drivers')
@UseGuards(CookieAuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly drivers: DriversService) {}

  @Get('me')
  @Roles('driver', 'admin')
  async me(@Req() req: RequestWithSession): Promise<DriverDashboardResponse> {
    const profileId = req.session!.profile.id;
    return this.drivers.getDashboard(profileId);
  }
}
