import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Logger,
    Request,
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { PaginationDto } from 'src/common';
  import { NATS_SERVICE } from 'src/config';
  import { UpdateContactDto } from '@travel-planning/contacts/dto/update-contact.dto';
  import { CreateContactDto } from '@travel-planning/contacts/dto/create-contact.dto';
import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('contacts')
  export class ContactsController {
    private readonly logger = new Logger(ContactsController.name);
    constructor(
      @Inject(NATS_SERVICE)
      private readonly contactsContact: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createContact(@Body() createContactDto: CreateContactDto, @Request() req) {
      const data = req['data'];

      try {
        const contact = await firstValueFrom(
          this.contactsContact.send(
            { cmd: 'create-contact' }, 
            { createContactDto, slug: data.slug }
          ),
        );
  
        return contact;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllContacts(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      return this.contactsContact.send(
        { cmd: 'find-all-contacts' }, 
        { paginationDto, slug: data.slug }
      );
    }
  
    @Get(':id')
    @Auth()
    async findOneContact(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const contact = await firstValueFrom(
          this.contactsContact.send(
            { cmd: 'find-one-contact' }, 
            { id, slug: data.slug }
          ),
        );
  
        return contact;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteContact(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const contact = await firstValueFrom(
          this.contactsContact.send(
            { cmd: 'remove-contact' }, 
            { id, slug: data.slug }
          ),
        );
  
        return contact;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Patch(':id')
    @Auth()
    async updateContact(
      @Param('id') id: string,
      @Body() updateContactDto: UpdateContactDto,
      @Request() req
    ) {
      const data = req['data'];

      try {
        const contact = await firstValueFrom(
          this.contactsContact.send(
            { cmd: 'update-contact' },
            { "updateContactDto": { id_contact: id, ...updateContactDto }, slug: data.slug }
          ),
        );
  
        return contact;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  }
  