// jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { envs } from '@app/config';
import { createHash } from 'crypto';
import { compactDecrypt } from 'jose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret_key = createHash('sha256').update(envs.cryptKey).digest();

  constructor(private readonly jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token);

      const { data: payloadEncrypted } = decodedToken;
      const { plaintext } = await compactDecrypt(payloadEncrypted, this.secret_key);

      request.data = JSON.parse(new TextDecoder().decode(plaintext));

      return true;
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }
}