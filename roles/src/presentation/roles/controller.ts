import { Request, Response } from "express";
import { CreateRoleDto, UpdateRoleDto } from "@domain/dtos";
import {
  CreateRole,
  CustomError,
  DeleteRole,
  GetRole,
  GetRoles,
  RoleRepository,
  UpdateRole,
} from "@domain/index";
import { buildLogger } from "@plugins/logger.plugin";
export class RoleController {

  
  constructor(private readonly todoRepository: RoleRepository) {}

  private readonly logger = buildLogger('RoleController');


  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    if (error instanceof Error) {
      this.logger.error(error.message);
      res.status(500).json({ error: "Internal server error - check logs" });
      return;
    }
  
    this.logger.error("Unknown error");
    res.status(500).json({ error: "Internal server error - check logs" });
  };

  public getRoles = (req: Request, res: Response) => {
    new GetRoles(this.todoRepository)
      .execute()
      .then((Role) => res.json(Role))
      .catch((error) => this.handleError(res, error));
  };

  public getRoleById = (req: Request, res: Response) => {
    const id = +req.params.id;

    new GetRole(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public createRole = (req: Request, res: Response) => {
    const [error, createRoleDto] = CreateRoleDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreateRole(this.todoRepository)
      .execute(createRoleDto!)
      .then((todo) => res.status(201).json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public updateRole = (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateRoleDto] = UpdateRoleDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    new UpdateRole(this.todoRepository)
      .execute(updateRoleDto!)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public deleteRole = (req: Request, res: Response) => {
    const id = +req.params.id;

    new DeleteRole(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };
}
