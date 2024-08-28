import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createRoleDto: CreateRoleDto) {
    return this.role.create({
      data: createRoleDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.role.count({
      where: { status: true },
    });
    const lastPage = Math.ceil(totalPages / limit);

    const roles = await this.role.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { status: true },
    });

    return {
      data: roles,
      meta: {
        total_records: totalPages,
        current_page: page,
        total_pages: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const role = await this.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new RpcException({
        message: `Role id ${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateRoleDto;

    await this.findOne(id);

    return this.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.role.update({
      where: { id },
      data: { status: false },
    });
  }
}
