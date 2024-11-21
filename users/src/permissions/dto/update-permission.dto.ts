import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreatePermissionDto } from '@permissions/dto/create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsString()
  id_permission: string;
}
