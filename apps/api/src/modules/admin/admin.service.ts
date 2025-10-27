import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { AdminDashboardResponse, QuoteDto } from '@jrdriving/shared';
import { DatabaseService } from '../../database/database.service';
import { schema } from '../../database/database.module';
import { MissionsService } from '../missions/missions.service';

@Injectable()
export class AdminService {
  constructor(private readonly database: DatabaseService, private readonly missions: MissionsService) {}

  private mapQuote(record: typeof schema.quotes.$inferSelect): QuoteDto {
    return {
      id: record.id,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      companyName: record.companyName ?? null,
      vehicleType: record.vehicleType,
      departureLocation: record.departureLocation,
      arrivalLocation: record.arrivalLocation,
      preferredDate: record.preferredDate ? record.preferredDate.toISOString() : null,
      message: record.message ?? null,
      status: record.status as QuoteDto['status'],
      estimatedPrice: record.estimatedPrice ?? null,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
    };
  }

  async getDashboard(): Promise<AdminDashboardResponse> {
    const { db } = this.database;
    const { missions, profiles, quotes } = schema;

    const [allMissions, driverProfiles, clientProfiles, pendingQuotes, recentMissions] = await Promise.all([
      db.select().from(missions),
      db.select({ id: profiles.id }).from(profiles).where(eq(profiles.role, 'driver')),
      db.select({ id: profiles.id }).from(profiles).where(eq(profiles.role, 'client')),
      db.select().from(quotes).where(eq(quotes.status, 'new')),
      this.missions.findRecent(5),
    ]);

    const activeMissions = allMissions.filter((mission) => mission.status === 'in_progress' || mission.status === 'assigned');
    const revenue = allMissions
      .filter((mission) => mission.status === 'completed' && mission.price)
      .reduce((total, mission) => total + (mission.price ?? 0), 0);

    return {
      stats: {
        totalMissions: allMissions.length,
        activeMissions: activeMissions.length,
        totalDrivers: driverProfiles.length,
        totalClients: clientProfiles.length,
        pendingQuotes: pendingQuotes.length,
        revenue,
      },
      recentMissions: recentMissions,
      pendingQuotes: pendingQuotes.map((quote) => this.mapQuote(quote)),
    };
  }
}
