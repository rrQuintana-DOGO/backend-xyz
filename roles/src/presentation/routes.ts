import { Router } from "express";
import { RoleRoutes } from "@presentation/roles/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/roles", RoleRoutes.routes);

    return router;
  }
}
