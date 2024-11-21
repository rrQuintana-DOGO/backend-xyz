import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@users/users/dto/create-user.dto';
import { IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID('4', { message: 'El id_user debe ser un UUID válido' })
  id_user: string;
}
