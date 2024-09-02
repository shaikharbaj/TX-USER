import { IsNotEmpty } from "class-validator";


export class FetchRolesPermissionsDto {
    @IsNotEmpty({ message: 'Please enter role ids' })
    readonly role_ids: number[]
}