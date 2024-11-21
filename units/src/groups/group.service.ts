import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateGroupDto } from '@groups/dto/create-group.dto';
import { UpdateGroupDto } from '@groups/dto/update-group.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { Group } from '@groups/entities/group.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService
  ) {}

  async create( createGroupDto: CreateGroupDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { configuration, ...groupDetails} = createGroupDto;
    let configurationId: string;

    try {
      if (configuration) {
        configurationId = await dbConnection.config_groups.create({
          data: configuration,
        }).then((configuration) => configuration.id_config_group);
      }

      const group = await dbConnection.groups.create({
        data: {
          ...groupDetails,
          id_config_group: configurationId,
        },
      });

      return this.findOne(group.id_group, slug, group.status);
      
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el grupo ${createGroupDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      }); 
    }
  }

  async validateGroupsExist(groups: string[], slug: string): Promise<void> {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    const nonExistentGroups: string[] = [];
  
    for (const groupId of groups) {
      const groupExist = await dbConnection.groups.findUnique({
        where: { id_group: groupId, status: true },
      });
  
      if (!groupExist) {
        nonExistentGroups.push(groupId);
      }
    }
  
    if (nonExistentGroups.length > 0) {
      throw new RpcException({
        message: `Los siguientes grupos no existen: ${nonExistentGroups.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  transformData(group: Group){
    const { config_groups, id_config_group, ...groupDetails } = group;

    return {
      ...groupDetails,
      configuration: {
        id_config_group,
        ...config_groups
      }
    };
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    const { page, limit } = paginationDto;

    try{

      const totalPages = await dbConnection.groups.count({
        where: { status: true },
      });
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const groups = await dbConnection.groups.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: { config_groups: true},
      });

      const transformedGroups = groups.map((group) => this.transformData(group));

      return {
        data: transformedGroups,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los grupos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const device = await dbConnection.groups.findUnique({
      where: { id_group: id, status },
      include: { config_groups: true },
    });

    if (!device) {
      throw new RpcException({
        message: `El grupo con id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(device);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { configuration, ...groupDetails } = updateGroupDto;
      let configurationId: string;

      if (configuration) {
        const existingGroup = await dbConnection.groups.findUnique({ where: { id_group: id } });
        if (existingGroup && existingGroup.id_config_group) {
          configurationId = await dbConnection.config_groups.update({
            where: { id_config_group: existingGroup.id_config_group },
            data: configuration,
          }).then((configuration) => configuration.id_config_group);
        } else {
          configurationId = await dbConnection.config_groups.create({
            data: configuration,
          }).then((configuration) => configuration.id_config_group);
        }
      }

      const group = await dbConnection.groups.update({
        where: { id_group: id },
        data: {
          ...groupDetails,
          id_config_group: configurationId,
        },
      });

      return this.findOne(group.id_group, slug, group.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el grupo ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const group = await this.findOne(id, slug);

    await dbConnection.groups.update({
      where: { id_group: id },
      data: { status: false },
    });

    try{
      return dbConnection.config_groups.update({
        where: { id_config_group: group.configuration.id_config_group }, 
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el grupo ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
