export class CreateRecordDto {
  batteryLevel?: number;
  channelId?: number;
  device?: {
    id?: number;
    name?: string;
    selfName?: string;
    typeId?: number;
  };
  gsm?: {
    cellid?: number;
    lac?: number;
    mcc?: number;
    mnc?: number;
  };
  ident?: string;
  messageBufferedStatus?: boolean;
  peer?: string;
  position?: {
    altitude?: number;
    direction?: number;
    hdop?: number;
    latitude?: number;
    lbsLatitude?: number;
    lbsLongitude?: number;
    longitude?: number;
    speed?: number;
    timestamp?: number;
  };
  protocolId?: number;
  protocolVersion?: string;
  rebootDinId?: number;
  rebootReasonEnum?: number;
  recordSeqnum?: number;
  reportCode?: string;
  reportReason?: number;
  serverTimestamp?: number;
  timestamp?: number;
  timestampKey?: number;
}
