import { ExecutionContext, Injectable } from "@nestjs/common";
import { I18nResolver, I18nResolverOptions } from "nestjs-i18n";

@Injectable()
export class CustomLangResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[]) {}

  resolve(context: ExecutionContext) {
    let req: any;
    let lang: string = "en";
    switch (context.getType() as string) {
      case "rpc":
        req = context.switchToHttp().getRequest();
        break;
      case "http":
        req = context.switchToHttp().getRequest();
        break;
      case "graphql":
        [, , { req }] = context.getArgs();
        break;
    }

    if (req) {
      lang = req?.lang;
    }

    return lang;
  }
}
