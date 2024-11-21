import { DataBaseManagerService } from '@app/db_manager/db_manager.service';
import { PrismaClient } from '@prisma/client';


type ModelName = Exclude<keyof PrismaClient, '$connect' | '$disconnect' | '$executeRaw' | '$executeRawUnsafe' | '$on' | '$transaction' | '$use'>;

const dbManager = new DataBaseManagerService();
export async function updateHasTableRecords(
  slug:string,
  tableName: ModelName,
  records: Array<Record<string, any>>,
  idField: string
) {
  const prisma= await dbManager.getPostgresConnection(slug);
  const table = prisma[tableName] as any;

  const existingRecords = await table.findMany();
  const existingRecordsMap = new Map(existingRecords.map(record => [record[idField], record]));

  for (const record of records) {
    const recordId = record[idField];
    if (existingRecordsMap.has(recordId)) {
      const existingRecord = existingRecordsMap.get(recordId);
      const hasChanges = Object.keys(record).some(key => record[key] !== existingRecord[key]);

      if (hasChanges) {
        await table.update({
          where: { [idField]: recordId },
          data: { ...record },
        });
      }
      existingRecordsMap.delete(recordId);
    } else {
      await table.create({
        data: { ...record },
      });
    }
  }

  for (const [recordId] of existingRecordsMap) {
    await table.delete({
      where: { [idField]: recordId },
    });
  }
}

export async function deleteHasTableRecords(slug:string, tableName: ModelName, idColumn: string, id: string) {
  const prisma= await dbManager.getPostgresConnection(slug);
  const table = prisma[tableName] as any;

  await table.deleteMany({
    where: { [idColumn]: id },
  });
}

export async function createHasTableRecords(slug:string, tableName: ModelName, records: Array<Record<string, any>>) {
  const prisma= await dbManager.getPostgresConnection(slug);
  const table = prisma[tableName] as any;
  return table.createMany({
    data: records.map(record => ({
      ...record,
    })),
  });
}
