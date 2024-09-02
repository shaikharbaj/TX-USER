/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { IsNumericIndexedArray } from 'src/common/custom-validation-decorators';

export class UpdateAddressDto {
    @IsNotEmpty({ message: '_please_enter_address_name' })
    readonly address_name: string;

    @IsNotEmpty({ message: '_please_enter_full_name' })
    readonly full_name: string;

    @IsNotEmpty({ message: '_please_enter_mobile_number' })
    readonly mobile_number: string;

    @IsNotEmpty({ message: '_please_enter_pincode' })
    readonly pincode: string;

    @IsNotEmpty({ message: '_please_enter_address1' })
    readonly address1: string;

    @IsOptional({ message: '_please_enter_address2' })
    readonly address2: string;

    @IsOptional({ message: '_please_enter_landmark' })
    readonly landmark: string;

    @IsNotEmpty({ message: '_please_enter_city' })
    readonly city: string;

    @IsNotEmpty({ message: '_please_enter_state' })
    readonly state: string;

    @IsNotEmpty({ message: '_please_enter_country' })
    readonly country: string;

    @IsNotEmpty({message:'_please_enter_delivery_days'})
    @IsNumericIndexedArray()
    readonly delivery_days: string;

    @IsNotEmpty()
    @IsBoolean({ message: '_please_enter_is_default' })
    readonly is_default: boolean;

    @IsOptional()
    @IsBoolean({ message: '_please_enter_is_active' })
    readonly is_active: boolean;
}
