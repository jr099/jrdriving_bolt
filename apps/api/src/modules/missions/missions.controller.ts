import { Body, Controller, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { MissionStatusUpdateDto, MissionDto } from '@jrdriving/shared';
import { MissionsService } from './missions.service';
import { CookieAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

const updateSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
});

@Controller('missions')
@UseGuards(CookieAuthGuard, RolesGuard)
export class MissionsController {
  constructor(private readonly missions: MissionsService) {}

  @Patch(':id/status')
  @Roles('driver', 'admin')
  async updateStatus(
    @Param('id', ParseIntPipe) missionId: number,
    @Body() body: unknown
  ): Promise<MissionDto> {
    const payload = updateSchema.parse(body) as MissionStatusUpdateDto;
    return this.missions.updateStatus(missionId, payload.status);
  }
}
