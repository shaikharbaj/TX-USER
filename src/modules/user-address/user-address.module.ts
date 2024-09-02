import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserAddressController } from './user-address.controller';
import { UserAddressService } from './user-address.service';
import { UserAddressRepository } from './repository';

@Module({
  imports: [PrismaModule],
  controllers: [UserAddressController],
  providers: [
    UserAddressService,
    UserAddressRepository,
  ],
  exports: [UserAddressService],
})
export class UserAddressModule {}
