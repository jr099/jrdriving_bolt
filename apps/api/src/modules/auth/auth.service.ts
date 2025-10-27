import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { AuthCredentialsDto, AuthSession, SignupDto } from '@jrdriving/shared';
import { DatabaseService } from '../../database/database.service';
import { schema } from '../../database/database.module';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly sessions: SessionsService,
    private readonly config: ConfigService
  ) {}

  async signUp(payload: SignupDto): Promise<AuthSession> {
    const { db } = this.db;
    const { users, profiles } = schema;

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, payload.email)).limit(1);
    if (existing) {
      throw new ConflictException('Un compte existe déjà pour cet email.');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const [userResult] = await db
      .insert(users)
      .values({ email: payload.email, passwordHash })
      .returning({ id: users.id });

    if (!userResult) {
      throw new BadRequestException("Impossible de créer l'utilisateur");
    }

    await db.insert(profiles).values({
      userId: userResult.id,
      fullName: payload.fullName,
      phone: payload.phone,
      role: payload.role,
      plan: 'free',
    });

    const session = await this.sessions.getSessionByUserId(userResult.id);
    if (!session) {
      throw new BadRequestException('Profil utilisateur introuvable.');
    }

    return session;
  }

  async signIn(credentials: AuthCredentialsDto): Promise<AuthSession> {
    const { db } = this.db;
    const { users } = schema;

    const [user] = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide.');
    }

    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email ou mot de passe invalide.');
    }

    const session = await this.sessions.getSessionByUserId(user.id);
    if (!session) {
      throw new UnauthorizedException('Profil utilisateur introuvable.');
    }

    return session;
  }

  signToken(payload: { userId: number; role: string }): string {
    return this.jwt.sign({ sub: payload.userId, role: payload.role });
  }

  verifyToken(token: string): { userId: number; role: string } | null {
    try {
      const decoded = this.jwt.verify<{ sub: number; role: string }>(token);
      return { userId: decoded.sub, role: decoded.role };
    } catch (error) {
      return null;
    }
  }

  get cookieName() {
    return this.config.get<string>('AUTH_COOKIE_NAME', 'jrdriving_session');
  }

  get cookieMaxAge() {
    return this.config.get<number>('AUTH_COOKIE_MAX_AGE', 60 * 60 * 24 * 30) * 1000;
  }

  getCookieOptions() {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: isProduction,
      maxAge: this.cookieMaxAge,
    };
  }
}
