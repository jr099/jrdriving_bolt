import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthSession } from '@jrdriving/shared';
import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';

export interface RequestWithSession extends Request {
  session?: AuthSession;
}

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly sessions: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithSession>();
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

    req.session = session;
    return true;
  }
}
