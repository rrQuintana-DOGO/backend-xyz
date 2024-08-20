import { buildLogger } from "@plugins/logger.plugin";
const logger = buildLogger("roles");

logger.log("Hello, world!");
logger.error("Goodbye, world!");