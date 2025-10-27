import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@jrdriving/shared';
import { ROLES_KEY } from './roles.decorator';
import type { RequestWithSession } from './auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithSession>();
    const role = req.session?.profile.role;

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException('Accès non autorisé.');
    }

    return true;
  }
}
