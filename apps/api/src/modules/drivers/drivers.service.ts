import { Injectable } from '@nestjs/common';
import type { DriverDashboardResponse } from '@jrdriving/shared';
import { MissionsService } from '../missions/missions.service';

@Injectable()
export class DriversService {
  constructor(private readonly missions: MissionsService) {}

  async getDashboard(profileId: number): Promise<DriverDashboardResponse> {
    const missions = await this.missions.findByDriver(profileId);
    const stats = {
      totalMissions: missions.length,
      inProgress: missions.filter((mission) => mission.status === 'in_progress').length,
      completed: missions.filter((mission) => mission.status === 'completed').length,
      totalKm: missions.reduce((total, mission) => total + (mission.distanceKm ?? 0), 0),
    };

    return { stats, missions };
  }
}
