import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ClientService } from '@clients/clients.service';
import { CreateClientDto } from '@clients/dto/create-client.dto';
import { UpdateClientDto } from '@clients/dto/update-client.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('clients')
export class  ClientsController {
  constructor(private readonly clientsService: ClientService) {}

  @MessagePattern({ cmd: 'create-client' })
  @UUIDGuard('contacts')
  create(@Payload() data: { createClientDto: CreateClientDto, slug: string }) {
    const { createClientDto, slug } = data;

    return this.clientsService.create(createClientDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-clients' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.clientsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-client' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.clientsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-client' })
  @UUIDGuard(['contacts'])
  update(@Payload() data: { updateClientDto: UpdateClientDto, slug: string }) {
    const { updateClientDto, slug } = data;

    return this.clientsService.update(updateClientDto.id_client, updateClientDto, slug);
  }

  @MessagePattern({ cmd: 'remove-client' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.clientsService.remove(id, slug);
  }
}
