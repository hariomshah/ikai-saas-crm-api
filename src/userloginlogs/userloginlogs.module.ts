import { Module } from '@nestjs/common';
import { UserloginlogsController } from './userloginlogs.controller';
import { UserloginlogsService } from './userloginlogs.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserloginlogsController],
  providers: [UserloginlogsService]
})
export class UserloginlogsModule {}
