import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from '@roles/dto/create-role.dto';
import { IsString, IsPositive, IsUUID } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsUUID('4', { message: 'El id_role debe ser un UUID válido' })
  id_role: string;
}
