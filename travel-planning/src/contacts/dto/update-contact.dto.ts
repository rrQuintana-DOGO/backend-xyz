import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from '@contacts/dto/create-contact.dto';
import { IsString } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsString()
  id_contact: string;
}

