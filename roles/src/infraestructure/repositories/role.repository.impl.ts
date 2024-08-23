
import {  CreateRoleDto, RoleDatasource, RoleEntity, RoleRepository, UpdateRoleDto } from '@domain/index';


export class RoleRepositoryImpl implements RoleRepository {
  constructor(
    private readonly datasource : RoleDatasource
  ){}


  create( createRoleDto: CreateRoleDto ): Promise<RoleEntity> {
    return this.datasource.create( createRoleDto );
  }

  getAll(): Promise<RoleEntity[]> {
    return this.datasource.getAll();
  }

  findById( id: number ): Promise<RoleEntity> {
    return this.datasource.findById( id );
  }

  updateById( updateRoleDto: UpdateRoleDto ): Promise<RoleEntity> {
    return this.datasource.updateById( updateRoleDto );
  }

  deleteById( id: number ): Promise<RoleEntity> {
    return this.datasource.deleteById( id );
  }
}