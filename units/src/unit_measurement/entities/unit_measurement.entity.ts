export class UnitMeasurement {
  public name: string;
  public symbol: string;
  public convertion: object;
  public status: boolean;

  constructor(
    name: string,
    symbol: string,
    convertion: object,
    status: boolean,
  ) {
    this.name = name;
    this.symbol = symbol;
    this.convertion = convertion;
    this.status = status || true;
  }
}
