import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from '@modules/dto/create-module.dto';
import { IsString, IsUUID } from 'class-validator';


export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsUUID('4', { message: 'El id_module debe ser un UUID válido' })
  id_module: string;
}
