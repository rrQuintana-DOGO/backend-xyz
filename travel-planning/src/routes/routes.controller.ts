import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PaginationDto } from '@app/common';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';

@Controller()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @MessagePattern({cmd:'create-route'})
  create(@Payload() data: {createRouteDto: CreateRouteDto, slug: string}) {
    const { createRouteDto, slug } = data;

    return this.routesService.create(createRouteDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-routes' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.routesService.findAll(slug, paginationDto);
  }

  @MessagePattern({cmd:'find-one-route'})
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.routesService.findOne(id, slug);
  }

  @MessagePattern({cmd:'update-route'})
  update(@Payload() data: { updateRouteDto: UpdateRouteDto, slug: string }) {
    const { updateRouteDto, slug } = data;

    return this.routesService.update(updateRouteDto.id, updateRouteDto, slug);
  }

  @MessagePattern({cmd:'remove-route'})
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.routesService.remove(id, slug);
  }
}
