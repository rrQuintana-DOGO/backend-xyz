import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUnitTypeDto } from '@units_type/dto/create-unit-type.dto';
import { UpdateUnitTypeDto } from '@units_type/dto/update-unit-type.dto';
import { PaginationDto } from '@common/index';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '@app/config';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class UnitTypeService {
  private readonly logger = new Logger(UnitTypeService.name);

  constructor(
    @Inject(NATS_SERVICE) 
    private readonly clientUnitsType: ClientProxy,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createUnitTypeDto: CreateUnitTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try{
      return dbConnection.unit_types.create({
        data: createUnitTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el tipo de unidad ${createUnitTypeDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{
      const totalPages = await dbConnection.unit_types.count();
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const units = await dbConnection.unit_types.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: units,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los tipos de unidades';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const unit_type = await dbConnection.unit_types.findUnique({
      where: { id_unit_type: id, status },
    });

    if (!unit_type) {
      this.logger.error(`Tipo de unidad con id ${id} no encontrado`);
      throw new RpcException({
        message: `Tipo de unidad con id ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return unit_type;
  }

  async update(id: string, updateUnitTypeDto: UpdateUnitTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_unit_type: __, ...data } = updateUnitTypeDto;    
    await this.findOne(id, slug);

    try{
      return dbConnection.unit_types.update({
        where: { id_unit_type: id },
        data: updateUnitTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el tipo de unidad ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.unit_types.update({
        where: { id_unit_type: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el tipo de unidad ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
