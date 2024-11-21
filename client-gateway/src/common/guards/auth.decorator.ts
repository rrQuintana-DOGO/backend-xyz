// auth.decorator.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

export function Auth() {
  return UseGuards(JwtAuthGuard);
}