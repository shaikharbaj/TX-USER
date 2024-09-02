/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ToggleAdminUserVisibilityDto {
  @IsNotEmpty({ message: '_please_enter_visibility_type' })
  @IsBoolean({ message: '_please_enter_valid_value' })
  readonly is_active: boolean;
}
