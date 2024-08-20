import { buildLogger } from "@plugins/logger.plugin";
import { PrismaClient } from "@prisma/client";

const logger = buildLogger("roles");

(async() => {
    main();
})();

async function main(){
    const prisma = new PrismaClient();

    // const newRole = await prisma.roleModel.create({
    //     data: {
    //         name: 'Admin'
    //     }
    // });
    // logger.log(`Role created: ${newRole.name}`);

    const roles = await prisma.roleModel.findMany();
    logger.log(`Roles: ${JSON.stringify(roles)}`);
}