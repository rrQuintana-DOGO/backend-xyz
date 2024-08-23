import { Router } from "express";
import { RoleController } from "@presentation/roles/controller";
import { RoleDataSourceImpl } from "@infraestructure/datasources/role.datasource.impl";
import { RoleRepositoryImpl } from "@infraestructure/repositories/role.repository.impl";

export class RoleRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new RoleDataSourceImpl();
    const todoRepository = new RoleRepositoryImpl(datasource);
    const todoController = new RoleController(todoRepository);

    router.get("/", todoController.getRoles);
    router.get("/:id", todoController.getRoleById);
    router.post("/", todoController.createRole);
    router.put("/:id", todoController.updateRole);
    router.delete("/:id", todoController.deleteRole);

    return router;
  }
}
