import { Module } from '@nestjs/common';
import { HomescreenController } from './homescreen.controller';
import { HomescreenService } from './homescreen.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HomescreenController],
  providers: [HomescreenService]
})
export class HomescreenModule {}
