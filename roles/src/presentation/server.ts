
import { PostgresLogDataSource } from "@infraestructure/datasources/postgres-log.datasource";
import { RoleRepositoryImpl } from "@infraestructure/repositories/role.repository.impl";

const postgresLogDataSource = new RoleRepositoryImpl(new PostgresLogDataSource());
export class Server {
    public static async start() {
        console.log("Server started");
    }
}