/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ToggleAddressDefaultDto {
  @IsNotEmpty({ message: '_please_enter_is_default' })
  @IsBoolean({ message: '_please_enter_is_default_value' })
  readonly is_default: boolean;
}
