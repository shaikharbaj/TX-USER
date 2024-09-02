// i18n-validation.pipe.ts
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import { I18nService, I18nContext } from "nestjs-i18n";
import { ValidationPipe, ValidationError } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class I18nValidationPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  constructor(private readonly i18n: I18nService) {
    super({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      forbidUnknownValues: false,
      disableErrorMessages: false,
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const lang = I18nContext.current().lang;
        return new RpcException({
          statusCode: 422,
          error: "Unprocessable Entity",
          message: errors.reduce((acc, e) => {
            const handleNestedErrors = (error: any) => {
              if (error.children && error.children.length > 0) {
                return error.children.reduce(
                  (nestedAcc: any, nestedError: any) => {
                    return {
                      ...nestedAcc,
                      ...handleNestedErrors(nestedError),
                    };
                  },
                  {}
                );
              } else {
                return {
                  [error.property]: Object.values(error.constraints).map(
                    (message) => this.i18n.translate(`validation.${message}`, { lang })
                  ),
                };
              }
            };

            return {
              ...acc,
              ...handleNestedErrors(e),
            };
          }, {}),
        });
      },
    });
  }
}
