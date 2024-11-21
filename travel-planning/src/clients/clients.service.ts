import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateClientDto } from '@clients/dto/create-client.dto';
import { UpdateClientDto } from '@clients/dto/update-client.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { Client } from '@clients/entities/client.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async validateContactsExist(contacts: string[], slug: string): Promise<void> {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentContacts: string[] = [];

    for (const contact of contacts) {
        const exists = await dbConnection.contacts.findUnique({  where: { id_contact: contact } });

        if (!exists) {
            nonExistentContacts.push(contact);
        }
    }

    if (nonExistentContacts.length > 0) {
      throw new RpcException({
        message: `Los siguientes contactos no existen: ${nonExistentContacts.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async create(createClientDto: CreateClientDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    const { contacts, ...clientDetails } = createClientDto;

    if (contacts) {
      await this.validateContactsExist(contacts, slug);
    }

    try {
      const client = await dbConnection.clients.create({
        data: clientDetails
      });

      if (contacts) {
        await dbConnection.client_has_contacts.createMany({
          data: contacts.map((contact) => ({
            id_client: client.id_client,
            id_contact: contact,
          })),
        });
      }

      return await this.findOne(client.id_client, slug, client.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrio un problema al crear el cliente',
      });
    }
  }

  transformData(client: Client) {
    const { client_has_contacts, ...rest } = client;
    return {
      ...rest,
      contacts: client_has_contacts.map((contact) => ({
        id_contact: contact.id_contact,
        name: contact.contacts.name,
        email: contact.contacts.email,
      })),
    };
  }

  async validateClientsExist(clients: string[], field: string = 'id_client', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentClients: string[] = [];
    const existentClients: Partial<Client>[] = [];

    for (const client of clients) {
      const clientExist = await dbConnection.clients.findFirst({
        where: { [field]: client, status: true },
        select: { id_client: true, name: true },
      });

      if (!clientExist) {
        nonExistentClients.push(client);
      } else {
        existentClients.push(clientExist);
      }
    }

    if (nonExistentClients.length > 0) {
      throw new RpcException({
        message: nonExistentClients.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentClients;
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
      const [total_records, clients] = await Promise.all([
        dbConnection.clients.count({
          where: { status: true },
        }),
        dbConnection.clients.findMany({
          skip: limit === -1 ? 0 : (page - 1) * limit,
          take: limit === -1 ? undefined : limit,
          where: { status: true },
          include: {
            client_has_contacts: {
              include: {
                contacts: {
                  select: {
                    id_contact: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { name: 'asc' },
        }),
      ]);

      const lastPage = limit === -1 ? 1 : Math.ceil(total_records / limit);
      validatePageAndLimit(page, lastPage);

      const transformedClients = clients.map((client) =>
        this.transformData(client),
      );

      return {
        data: transformedClients,
        meta: {
          total_records,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener los clientes';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const client = await dbConnection.clients.findUnique({
      where: { id_client: id, status },
      include: {
        client_has_contacts: {
          include: {
            contacts: {
              select: {
                id_contact: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      throw new RpcException({
        message: `El cliente con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    
    const { contacts, ...clientDetails } = updateClientDto;
  
    await this.findOne(id, slug);

    if (contacts) {
      await this.validateContactsExist(contacts, slug);
    }

    try {
      await dbConnection.clients.update({
        where: { id_client: id },
        data: clientDetails,
      });

      if (contacts) {
        const currentContacts = await dbConnection.client_has_contacts.findMany({
          where: { id_client: id },
          select: { id_contact: true },
        });

        const currentContactIds = new Set(
          currentContacts.map((c) => c.id_contact),
        );
        const newContactIds = new Set(contacts.map((contact) => contact));

        const contactsToDelete = Array.from(currentContactIds).filter(
          (id) => !newContactIds.has(id),
        );

        const contactsToAdd = contacts.filter(
          (contact) => !currentContactIds.has(contact),
        );

        if (contactsToDelete.length > 0) {
          await dbConnection.client_has_contacts.deleteMany({
            where: {
              id_contact: { in: contactsToDelete },
              id_client: id,
            },
          });
        }

        if (contactsToAdd.length > 0) {
          await dbConnection.client_has_contacts.createMany({
            data: contactsToAdd.map(contact => ({
              id_client: id,
              id_contact: contact,
            })),
          });
        }
      }

      return this.findOne(id, slug, clientDetails.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al actualizar el cliente con el id ${id}`,
      });
    }
  }
  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.clients.update({
        where: { id_client: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar el cliente con el id ${id}`,
      });
    }
  }
}
