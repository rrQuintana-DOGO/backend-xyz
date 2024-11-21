import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from '@travel-planning/clients/dto/create-client.dto';
import { IsUUID } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsUUID('4', { message: 'El id del cliente debe ser un UUID válido' })
  id_client: string;
}

