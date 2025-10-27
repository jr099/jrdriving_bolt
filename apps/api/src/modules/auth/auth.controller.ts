import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';
import type { AuthSession } from '@jrdriving/shared';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  phone: z.string().min(4),
  role: z.enum(['client', 'driver']),
});

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly sessions: SessionsService) {}

  private setSessionCookie(res: Response, token: string) {
    res.cookie(this.auth.cookieName, token, this.auth.getCookieOptions());
  }

  @Post('signup')
  async signup(@Body() body: unknown, @Res({ passthrough: true }) res: Response): Promise<AuthSession> {
    const payload = signupSchema.parse(body);
    const session = await this.auth.signUp(payload);
    const token = this.auth.signToken({ userId: session.user.id, role: session.profile.role });
    this.setSessionCookie(res, token);
    return session;
  }

  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response): Promise<AuthSession> {
    const payload = credentialsSchema.parse(body);
    const session = await this.auth.signIn(payload);
    const token = this.auth.signToken({ userId: session.user.id, role: session.profile.role });
    this.setSessionCookie(res, token);
    return session;
  }

  @Get('session')
  async session(@Req() req: Request): Promise<AuthSession> {
    const token = req.cookies?.[this.auth.cookieName];
    if (!token) {
      throw new UnauthorizedException('Non authentifié.');
    }

    const decoded = this.auth.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Session invalide.');
    }

    const session = await this.sessions.getSessionByUserId(decoded.userId);
    if (!session) {
      throw new UnauthorizedException('Session expirée.');
    }

    return session;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.auth.cookieName, this.auth.getCookieOptions());
    return { success: true };
  }
}
