import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateDeviceDto } from '@devices/dto/create-device.dto';
import { UpdateDeviceDto } from '@devices/dto/update-device.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { GroupService } from '@groups/group.service';
import { DeviceTypeService } from '@devices_type/device-types.service';
import { Device } from '@devices/entities/device.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);
  
  constructor(
    private readonly groupService: GroupService,
    private readonly deviceTypeService: DeviceTypeService,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async verifyImeiExists(imei: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const device = await dbConnection.devices.findUnique({
      where: { imei: imei },
    });

    if (device) {
      throw new RpcException({
        message: `El imei ${imei} ya existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async verifyExternalIdExists(id_ext: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const device = await dbConnection.devices.findUnique({
      where: { id_ext:id_ext },
    });

    if (device) {
      throw new RpcException({
        message: `El id externo ${id_ext} ya existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
  
  async create(createDeviceDto: CreateDeviceDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.deviceTypeService.findOne(createDeviceDto.id_device_type, slug);

    const { groups, ...data } = createDeviceDto;

    if(groups){
      await this.groupService.validateGroupsExist(groups, slug);
    }

    await this.verifyImeiExists(data.imei, slug);
    await this.verifyExternalIdExists(data.id_ext, slug);

    try{
      const device = await dbConnection.devices.create({
        data: data,
      });

      if (!groups) {
        return this.findOne(device.id_device, slug);
      }

      await dbConnection.device_has_groups.createMany({
        data: groups.map((group) => ({
          id_device: device.id_device,
          id_group: group,
        })),
      });

      return this.findOne(device.id_device, slug, device.status);

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el dispositivo ${createDeviceDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  transformData(device: Device) {
    const { device_has_groups, ...data } = device;
    return {
      ...data,
      groups: device_has_groups.map((group) => group.groups),
    };
  }

  async validateDeviceExist(devices: string[], slug: string): Promise<void> {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentDevices: string[] = [];
  
    for (const deviceId of devices) {
      const deviceExist = await dbConnection.devices.findUnique({
        where: { id_device: deviceId, status: true },
      });
  
      if (!deviceExist) {
        nonExistentDevices.push(deviceId);
      }
    }
  
    if (nonExistentDevices.length > 0) {
      throw new RpcException({
        message: `Los siguientes devices no existen: ${nonExistentDevices.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{
      const totalPages = await dbConnection.devices.count({
        where: { status: true },
      });
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const devices = await dbConnection.devices.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: { device_type: true, device_has_groups: { include: { groups: true} } },
      });

      const devicesData = devices.map((device) => this.transformData(device));

      return {
        data: devicesData,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los dispositivos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const device = await dbConnection.devices.findUnique({
      where: { id_device: id, status },
      include: { device_type: true, device_has_groups: { include: { groups: true} } }, 
    });

    if (!device) {
      throw new RpcException({
        message: `El dispositivo con id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(device);
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { groups, ...data } = updateDeviceDto;

    if (data.imei) {
      await this.verifyImeiExists(data.imei, slug);
    }
    
    if (data.id_ext) {
      await this.verifyExternalIdExists(data.id_ext, slug);
    }
  
    if (groups) {
      await this.groupService.validateGroupsExist(groups, slug);
    }
  
    await this.findOne(id, slug);
  
    try {
      await dbConnection.devices.update({
        where: { id_device: id },
        data: data,
      });
  
      const groupOps = [];
  
      if (groups) {
        const currentGroups = await dbConnection.device_has_groups.findMany({
          where: { id_device: id },
          select: { id_group: true },
        });
  
        const currentGroupIds = new Set(currentGroups.map(g => g.id_group));
        const newGroupIds = new Set(groups);
  
        const groupsToDelete = Array.from(currentGroupIds).filter(id => !newGroupIds.has(id));
        const groupsToAdd = Array.from(newGroupIds).filter(id => !currentGroupIds.has(id));
  
        if (groupsToDelete.length > 0) {
          groupOps.push(
            dbConnection.device_has_groups.deleteMany({
              where: {
                id_device: id,
                id_group: { in: groupsToDelete },
              },
            })
          );
        }
  
        if (groupsToAdd.length > 0) {
          groupOps.push(
            dbConnection.device_has_groups.createMany({
              data: groupsToAdd.map(group => ({
                id_device: id,
                id_group: group,
              })),
            })
          );
        }
      }
  
      await Promise.all(groupOps);
  
      return this.findOne(id, slug, data.status);
  
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `El dispositivo con id ${id} no pudo ser actualizado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.devices.update({
        where: { id_device: id },
        data: { status: false },
      });
    } catch (error) {
      throw new RpcException({
        message: `El dispositivo con id ${id} no pudo ser eliminado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
