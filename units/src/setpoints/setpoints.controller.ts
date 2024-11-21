import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SetpointsService } from '@setpoints/setpoints.service';
import { CreateSetpointDto } from '@setpoints/dto/create-setpoint.dto';
import { PaginationDto } from '@app/common';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { IdsDto } from '@setpoints/dto/ids.dto';
import { UpdateSetpointDto } from '@setpoints/dto/update-setpoint.dto';

@Controller()
export class SetpointsController {
  constructor(private readonly setpointsService: SetpointsService) {}

  @MessagePattern({ cmd: 'create-setpoint' })
  create(@Payload() data: { createSetpointDto: CreateSetpointDto, slug: string }) {
    const { createSetpointDto, slug } = data;

    return this.setpointsService.create(createSetpointDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-setpoints' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;
    return this.setpointsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'validate-setpoints' })
  validateEvents(@Payload()  idsDto: IdsDto ) {

    return this.setpointsService.validateSetpointsExist(
      idsDto.setpoints,
      idsDto.property,
      idsDto.slug
    );
  }

  @MessagePattern({ cmd: 'find-one-setpoint' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.setpointsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-setpoint' })
  @UUIDGuard('id')
  update(@Payload() data: { updateSetpointDto: UpdateSetpointDto, slug: string }) {
    const { updateSetpointDto, slug } = data;
    return this.setpointsService.update(
      updateSetpointDto.id_setpoint,
      updateSetpointDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-setpoint' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.setpointsService.remove(id, slug);
  }
}
