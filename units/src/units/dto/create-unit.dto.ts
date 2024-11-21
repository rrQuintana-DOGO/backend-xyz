import { IsBoolean, IsString, IsNumber, IsOptional,IsUUID,IsArray,IsNotEmpty} from 'class-validator';

export class CreateUnitDto {
  @IsOptional()
  //@IsString({message: 'El id de la unidad debe ser una cadena de texto'})
  @IsUUID('4', { message: 'El id de la unidad debe ser de tipo UUID' })
  public id_unit: string;

  @IsNotEmpty({ message : 'El nombre de la unidad no debe estar vacío' })
  @IsString({message: 'El nombre de la unidad debe ser una cadena de texto'})
  public name: string;

  @IsOptional()
  @IsString({message: 'El modelo de la unidad debe ser una cadena de texto'})
  public model : string;

  @IsNotEmpty({ message : 'Las placas de la unidad no deben estar vacío' })
  @IsString({message: 'Las placas de la unidad debe ser una cadena de texto'})
  public plate : string;

  @IsOptional()
  @IsNumber({}, { message: 'El año de la unidad debe ser un valor numérico' }) 
  public year: number;

  @IsBoolean({message: 'El status de la unidad debe ser un valor booleano'})
  public status: boolean;

  @IsNotEmpty({ message : 'El id_unit_type de la unidad no deben estar vacío' })
  @IsUUID('4', { message: 'El id_unit_type debe ser de tipo UUID' })
  public id_unit_type: string;

  @IsNotEmpty({ message : 'El id_fuel_type de la unidad no deben estar vacío' })
  @IsUUID('4', { message: 'El id_fuel_type debe ser de tipo UUID' })
  public id_fuel_type: string;

  @IsOptional()
  @IsArray({message: 'Los devices deben ser un arreglo de cadenas de texto'})
  @IsString({ each: true , message: 'Cada device debe ser una cadena de texto' })
  //  @IsNotEmpty({ each: true, message: 'No puede haber devices vacios' })
  public devices?: string[];

  @IsOptional()
  @IsUUID('4', { message: 'El fuel_setpoint debe ser de tipo UUID' })
  public fuel_setpoint: string;
}

/*
model units {
  id_unit                String                   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name                   String?                  @db.VarChar(50)
  model                  String?                  @db.VarChar(50)
  plate                  String?                  @db.VarChar(50)
  year                   Int?
  status                 Boolean?
  id_unit_type           String?                  @db.Uuid
  id_fuel_type           String?                  @db.Uuid
  unit_has_devices       unit_has_devices[]
  unit_has_fuel_setpoint unit_has_fuel_setpoint[]
  fuel_types             fuel_types?              @relation(fields: [id_fuel_type], references: [id_fuel_type], onDelete: NoAction, onUpdate: NoAction)
  units                  unit_types?              @relation("unitsTounits", fields: [id_unit_type], references: [id_unit_type], onDelete: NoAction, onUpdate: NoAction)
}
*/ 