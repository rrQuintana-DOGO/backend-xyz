import { CreateRecordDto } from 'src/mqtt/dto/createRecord.dto';

export function parseJsonStringToDto(
  jsonString: string,
): CreateRecordDto | null {
  let parsedData: any;

  try {
    parsedData = JSON.parse(jsonString);
  } catch (error) {
    console.error('Error al parsear la cadena JSON:', error);
    return null;
  }

  const dto: CreateRecordDto = {
    batteryLevel: parsedData['battery.level'] ?? null,
    channelId: parsedData['channel.id'] ?? null,
    device: {
      id: parsedData['device.id'] ?? null,
      name: parsedData['device.name'] ?? null,
      selfName: parsedData['device.name'] ?? null, // Se asume que selfName es lo mismo que device.name
      typeId: parsedData['device.type.id'] ?? null,
    },
    gsm: {
      cellid: parsedData['gsm.cellid'] ?? null,
      lac: parsedData['gsm.lac'] ?? null,
      mcc: parsedData['gsm.mcc'] ?? null,
      mnc: parsedData['gsm.mnc'] ?? null,
    },
    ident: parsedData['ident'] ?? null,
    messageBufferedStatus: parsedData['message.buffered.status'] ?? null,
    peer: parsedData['peer'] ?? null,
    position: {
      altitude: parsedData['position.altitude'] ?? null,
      direction: parsedData['position.direction'] ?? null,
      hdop: parsedData['position.hdop'] ?? null,
      latitude: parsedData['position.latitude'] ?? null,
      lbsLatitude: parsedData['position.lbs.latitude'] ?? null,
      lbsLongitude: parsedData['position.lbs.longitude'] ?? null,
      longitude: parsedData['position.longitude'] ?? null,
      speed: parsedData['position.speed'] ?? null,
      timestamp: parsedData['position.timestamp'] ?? null,
    },
    protocolId: parsedData['protocol.id'] ?? null,
    protocolVersion: parsedData['protocol.version'] ?? null,
    rebootDinId: parsedData['reboot.din.id'] ?? null,
    rebootReasonEnum: parsedData['reboot.reason.enum'] ?? null,
    recordSeqnum: parsedData['event.seqnum'] ?? null,
    reportCode: parsedData['report.code'] ?? null,
    reportReason: parsedData['event.enum'] ?? null,
    serverTimestamp: parsedData['server.timestamp'] ?? null,
    timestamp: parsedData['timestamp'] ?? null,
    timestampKey: parsedData['timestamp.key'] ?? null,
  };

  return dto;
}
