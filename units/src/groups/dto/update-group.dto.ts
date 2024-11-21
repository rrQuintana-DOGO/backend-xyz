import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from '@groups/dto/create-group.dto';
import { IsString } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsString()
  id_group: string;
}
