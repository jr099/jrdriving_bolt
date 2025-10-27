import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { schema } from '../../database/database.module';
import type { AuthSession, ProfilePayload } from '@jrdriving/shared';

@Injectable()
export class SessionsService {
  constructor(private readonly database: DatabaseService) {}

  async getSessionByUserId(userId: number): Promise<AuthSession | null> {
    const { db } = this.database;
    const { users, profiles } = schema;

    const [result] = await db
      .select({
        userId: users.id,
        email: users.email,
        createdAt: users.createdAt,
        profileId: profiles.id,
        fullName: profiles.fullName,
        phone: profiles.phone,
        role: profiles.role,
        plan: profiles.plan,
        avatarUrl: profiles.avatarUrl,
        profileCreatedAt: profiles.createdAt,
        profileUpdatedAt: profiles.updatedAt,
      })
      .from(users)
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      user: {
        id: result.userId,
        email: result.email,
        createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : String(result.createdAt),
      },
      profile: {
        id: result.profileId,
        userId: result.userId,
        fullName: result.fullName,
        phone: result.phone ?? null,
        role: result.role as ProfilePayload['role'],
        plan: result.plan ?? null,
        avatarUrl: result.avatarUrl ?? null,
        createdAt:
          result.profileCreatedAt instanceof Date
            ? result.profileCreatedAt.toISOString()
            : String(result.profileCreatedAt),
        updatedAt:
          result.profileUpdatedAt instanceof Date
            ? result.profileUpdatedAt.toISOString()
            : String(result.profileUpdatedAt),
      },
    };
  }
}
