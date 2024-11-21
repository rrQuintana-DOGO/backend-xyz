import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { PaginationDto } from '@app/common';

@Controller()
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @MessagePattern({ cmd: 'create-carrier' })
  create(@Payload() data: { createCarrierDto: CreateCarrierDto, slug: string }) {
    const { createCarrierDto, slug } = data;

    return this.carriersService.create(createCarrierDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-carriers' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.carriersService.findAll(slug, paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-carrier' })
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.carriersService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-carrier' })
  update(@Payload() data: { updateCarrierDto: UpdateCarrierDto, slug: string }) {
    const { updateCarrierDto, slug } = data;

    return this.carriersService.update(updateCarrierDto.id_carrier, updateCarrierDto, slug);
  }

  @MessagePattern({ cmd: 'remove-carrier' })
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.carriersService.remove(id, slug);
  }
}
