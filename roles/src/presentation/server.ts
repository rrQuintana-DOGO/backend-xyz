
import { PostgresLogDataSource } from "@infraestructure/datasources/postgres-log.datasource";

const postgresLogDataSource = new PostgresLogDataSource();
export class Server {
    public static async start() {
        console.log("Server started");
    }
}