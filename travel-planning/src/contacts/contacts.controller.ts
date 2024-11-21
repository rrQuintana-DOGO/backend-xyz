import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ContactService } from '@contacts/contacts.service';
import { CreateContactDto } from '@contacts/dto/create-contact.dto';
import { UpdateContactDto } from '@contacts/dto/update-contact.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('contacts')
export class  ContactsController {
  constructor(private readonly contactsService: ContactService) {}

  @MessagePattern({ cmd: 'create-contact' })
  create(@Payload() data: { createContactDto: CreateContactDto, slug: string }) {
    const { createContactDto, slug } = data;

    return this.contactsService.create(createContactDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-contacts' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.contactsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-contact' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.contactsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-contact' })
  @UUIDGuard('id_contact')
  update(@Payload() data: { updateContactDto: UpdateContactDto, slug: string }) {
    const { updateContactDto, slug } = data;

    return this.contactsService.update(
      updateContactDto.id_contact,
      updateContactDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-contact' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.contactsService.remove(id, slug);
  }
}
