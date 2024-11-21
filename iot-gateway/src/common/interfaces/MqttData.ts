export interface Device {
  id: number;
  name: string;
  selfName: string;
  typeId: number;
}

export interface Gsm {
  cellid: number;
  lac: number;
  mcc: number;
  mnc: number;
}

export interface Position {
  altitude: number;
  direction: number;
  hdop: number;
  latitude: number;
  lbsLatitude: number;
  lbsLongitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
}

export interface MqttData {
  batteryLevel: number;
  channelId: number;
  device: Device;
  gsm: Gsm;
  ident: string;
  messageBufferedStatus: boolean;
  peer: string;
  position: Position;
  protocolId: number;
  protocolVersion: string;
  rebootDinId: number;
  rebootReasonEnum: number;
  recordSeqnum: number;
  reportCode: string;
  reportReason: number;
  serverTimestamp: number;
  timestamp: number;
  timestampKey: number;
}
