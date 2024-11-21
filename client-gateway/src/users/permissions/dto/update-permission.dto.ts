import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsPositive } from 'class-validator';
import { CreatePermissionDto } from '@users/permissions/dto/create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsString()
  id_permission: string;
}
