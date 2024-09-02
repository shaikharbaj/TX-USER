import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";

export enum AdminStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class UpdateDocumentStatusDto {
  @IsEnum(AdminStatus, { message: "_please_select_valid_status" })
  @IsNotEmpty({ message: "_status_cannot_be_empty" })
  readonly admin_status: AdminStatus;

  @ValidateIf((o) => o.admin_status === AdminStatus.REJECTED)
  @IsNotEmpty({ message: "_please_provide_reason" })
  readonly reason?: string;
}
