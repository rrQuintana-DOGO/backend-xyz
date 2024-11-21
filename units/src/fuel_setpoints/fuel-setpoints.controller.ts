import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FuelSetpointsService } from '@fuel_setpoints/fuel-setpoints.service';
import { CreateFuelSetpointDto } from '@fuel_setpoints/dto/create-fuel-setpoint.dto';
import { UpdateFuelSetpointDto } from '@fuel_setpoints/dto/update-fuel-setpoint.dto';
import { PaginationDto } from '@app/common';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { IdsDto } from '@setpoints/dto/ids.dto';

@Controller()
export class FuelSetpointsController {
  constructor(private readonly FuelsetpointsService: FuelSetpointsService) {}

  @MessagePattern('create-fuel-setpoint')
  @UUIDGuard('id_unit_measure')
  create(@Payload() createFuelSetpointDto: CreateFuelSetpointDto) {
    return this.FuelsetpointsService.create(createFuelSetpointDto);
  }

  @MessagePattern('find-all-fuel-setpoints')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.FuelsetpointsService.findAll(paginationDto);
  }
 
  /*
  @MessagePattern({ cmd: 'ValidateSetpoints' })
  validateEvents(@Payload() idsDto: IdsDto) {
    return this.FuelsetpointsService.validateSetpointsExist(
      idsDto.setpoints,
      idsDto.property,
    );
  }
*/

  @MessagePattern('find-one-fuel-setpoint')
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.FuelsetpointsService.findOne(id);
  }

  @MessagePattern('update-fuelsetpoint')
  update(@Payload() updateFuelSetpointDto: UpdateFuelSetpointDto) {
    return this.FuelsetpointsService.update(
      updateFuelSetpointDto.id_fuel_setpoint,
      updateFuelSetpointDto
    );
  }

  @MessagePattern('remove-setpoint')
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.FuelsetpointsService.remove(id);
  }
}
