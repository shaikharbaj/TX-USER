/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional, Matches } from 'class-validator';
import { IsNumericIndexedArray } from 'src/common/custom-validation-decorators';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Please enter role name.' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Role name should not contain numbers or special characters.' })
  readonly role_name: string;

  @IsNotEmpty({ message: 'Please enter role slug.' })
  @Matches(/^[a-zA-Z_]+$/, { message: 'Role slug can only contain letters and underscores' })
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
