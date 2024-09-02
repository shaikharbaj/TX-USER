/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { IsNumericIndexedArray } from 'src/common/custom-validation-decorators';

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'Please enter role name.' })
  readonly role_name: string;

  @IsNotEmpty({ message: 'Please enter role slug.' })
  readonly slug: string;

  @IsNotEmpty({ message: 'Please enter description.' })
  readonly description: string;

  @IsOptional()
  @IsNumericIndexedArray()
  readonly permissions: string;

  @IsOptional()
  @IsBoolean({ message: 'Please enter valid value.' })
  readonly is_active: boolean;
}
