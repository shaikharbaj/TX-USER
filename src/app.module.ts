import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { CustomLangResolver } from './custom-lang-resolver';
import {
  SerialNumberConfigurationModule,
  PermissionModule,
  PrismaModule,
  RoleModule,
  UserModule,
  UserAddressModule,
} from './modules';
import { I18nValidationPipe } from './common/pipes';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: "en",
        loaderOptions: {
          path: join(__dirname, "/../i18n/"),
          watch: true,
        },
        typesOutputPath: join(__dirname, "../src/generated/i18n.generated.ts"),
      }),
      resolvers: [{ use: CustomLangResolver, options: ["lang"] }],
    }),
    PrismaModule,
    UserModule,
    RoleModule,
    PermissionModule,
    SerialNumberConfigurationModule,
    UserAddressModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: I18nValidationPipe,
    },
  ],
})
export class AppModule {}
