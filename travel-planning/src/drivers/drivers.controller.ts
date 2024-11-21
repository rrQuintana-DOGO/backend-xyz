import { Controller, ParseUUIDPipe, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PaginationDto } from '@app/common';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';

@Controller()
export class DriversController {
  private readonly logger = new Logger(DriversController.name);
  constructor(private readonly driversService: DriversService) {}

  @MessagePattern({ cmd: 'create-driver' })
  create(@Payload() data: { createDriverDto: CreateDriverDto, slug: string }) {
    const { createDriverDto, slug } = data;

    try {
      return this.driversService.create(createDriverDto, slug);
    } catch (error) {
      this.logger.log('error', error);
    }
  }

  @MessagePattern({ cmd: 'find-all-drivers' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.driversService.findAll(slug, paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-driver' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.driversService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-driver' })
  update(@Payload() data: { updateDriverDto: UpdateDriverDto, slug: string }) {
    const { updateDriverDto, slug } = data;

    return this.driversService.update(
      updateDriverDto.id_driver,
      updateDriverDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-driver' })
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.driversService.remove(id, slug);
  }
}
