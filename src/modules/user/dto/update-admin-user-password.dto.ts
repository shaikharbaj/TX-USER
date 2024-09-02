import { IsNotEmpty } from 'class-validator';
import { IsNotEqualTo } from 'src/common/custom-validation-decorators';
import { IsEqualTo } from 'src/common/custom-validation-decorators/is-equal.decorator';
import { ValidatePassword } from 'src/common/custom-validation-decorators/validate-password.decorator';

export class UpdateAdminUserPasswordDto {
    @IsNotEmpty({ message: '_please_enter_old_password' })
    readonly old_password: string;

    @IsNotEqualTo('old_password', {
        message: '_password_must_not_match_with_old_password',
    })
    @IsNotEmpty({ message: '_please_enter_password' })
    @ValidatePassword()
    readonly password: string;

    @IsEqualTo('password', {
        message: '_confirm_password_must_be_a_match_with_password',
    })
    readonly confirm_password: string;
}
