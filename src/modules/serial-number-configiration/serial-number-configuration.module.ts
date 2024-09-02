import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SerialNumberConfigurationService } from './serial-number-configuration.service';
import { SerialNumberConfigurationRepository } from './repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [SerialNumberConfigurationService, SerialNumberConfigurationRepository],
  exports: [SerialNumberConfigurationService],
})
export class SerialNumberConfigurationModule {}
