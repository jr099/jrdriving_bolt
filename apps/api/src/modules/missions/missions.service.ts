import { Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { schema } from '../../database/database.module';
import type { MissionDto, MissionStatus } from '@jrdriving/shared';

@Injectable()
export class MissionsService {
  constructor(private readonly database: DatabaseService) {}

  private mapMission(record: typeof schema.missions.$inferSelect): MissionDto {
    return {
      id: record.id,
      clientId: record.clientId,
      driverId: record.driverId ?? null,
      missionNumber: record.missionNumber,
      departureAddress: record.departureAddress,
      departureCity: record.departureCity,
      departurePostalCode: record.departurePostalCode,
      arrivalAddress: record.arrivalAddress,
      arrivalCity: record.arrivalCity,
      arrivalPostalCode: record.arrivalPostalCode,
      scheduledDate: record.scheduledDate instanceof Date
        ? record.scheduledDate.toISOString()
        : String(record.scheduledDate),
      scheduledTime: record.scheduledTime ?? null,
      actualStartTime: record.actualStartTime ? record.actualStartTime.toISOString() : null,
      actualEndTime: record.actualEndTime ? record.actualEndTime.toISOString() : null,
      distanceKm: record.distanceKm ?? null,
      price: record.price ?? null,
      status: record.status as MissionStatus,
      priority: record.priority as MissionDto['priority'],
      notes: record.notes ?? null,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
    };
  }

  async updateStatus(missionId: number, status: MissionStatus): Promise<MissionDto> {
    const { db } = this.database;
    const { missions } = schema;

    const [mission] = await db.select().from(missions).where(eq(missions.id, missionId)).limit(1);
    if (!mission) {
      throw new NotFoundException('Mission introuvable');
    }

    await db
      .update(missions)
      .set({ status, actualEndTime: status === 'completed' ? new Date() : mission.actualEndTime })
      .where(eq(missions.id, missionId));

    const [updated] = await db.select().from(missions).where(eq(missions.id, missionId)).limit(1);
    if (!updated) {
      throw new NotFoundException('Mission introuvable');
    }

    return this.mapMission(updated);
  }

  async findByDriver(profileId: number): Promise<MissionDto[]> {
    const { db } = this.database;
    const { missions } = schema;

    const records = await db
      .select()
      .from(missions)
      .where(eq(missions.driverId, profileId))
      .orderBy(desc(missions.scheduledDate));

    return records.map((record) => this.mapMission(record));
  }

  async findRecent(limit = 10): Promise<MissionDto[]> {
    const { db } = this.database;
    const { missions } = schema;

    const records = await db
      .select()
      .from(missions)
      .orderBy(desc(missions.createdAt), desc(missions.id))
      .limit(limit);

    return records.map((record) => this.mapMission(record));
  }
}
