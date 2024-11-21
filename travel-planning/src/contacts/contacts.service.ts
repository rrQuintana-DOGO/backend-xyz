import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from '@contacts/dto/create-contact.dto';
import { UpdateContactDto } from '@contacts/dto/update-contact.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createContactDto: CreateContactDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try{
      const contact = await dbConnection.contacts.create({
        data: createContactDto,
      });

      return this.findOne(contact.id_contact, slug, contact.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(
        {
          status: HttpStatus.BAD_REQUEST, 
          message: 'Ocurrio un problema al crear el contacto'
        },
      );
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{

      const totalPages = await dbConnection.contacts.count({
        where: { status: true },
      });
      const lastPage = Math.ceil(totalPages / limit);

      const contacts = await dbConnection.contacts.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: contacts,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };

      } catch (error) {
        this.logger.error(error);
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Ocurrio un problema al obtener los contactos',
        });
      }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const contact = await dbConnection.contacts.findUnique({
      where: { id_contact: id, status },
    });

    if (!contact) {
      throw new RpcException({
        message: `El contacto con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_contact: __, ...data } = updateContactDto;    
    await this.findOne(id, slug);

    try{
      await dbConnection.contacts.update({
        where: { id_contact: id },
        data: updateContactDto,
      });

      return this.findOne(id, slug, updateContactDto.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Ocurrio un problema al actualizar el contacto con el id ${id}`,
        },
      );
    }

  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.contacts.update({
        where: { id_contact: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Ocurrio un problema al eliminar el contacto con el id ${id}`,
        },
      )
    }
  }
}
