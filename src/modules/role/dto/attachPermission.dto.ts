/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AttachPermissionDto {
  @IsNotEmpty({ message: 'Please enter role id.' })
  @IsNumber()
  readonly role_id: number;
  @IsNotEmpty({ message: 'Please enter permissions.' })
  readonly permissions: string;
}
