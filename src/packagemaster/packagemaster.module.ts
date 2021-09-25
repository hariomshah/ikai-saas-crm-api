import { Module } from '@nestjs/common';
import { PackagemasterController } from './packagemaster.controller';
import { PackagemasterService } from './packagemaster.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PackagemasterController],
  providers: [PackagemasterService]
})
export class PackagemasterModule {}
