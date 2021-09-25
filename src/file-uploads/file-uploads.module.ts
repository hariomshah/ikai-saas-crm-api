import { Module } from '@nestjs/common';
import { FileUploadsController } from './file-uploads.controller';

@Module({
  controllers: [FileUploadsController]
})
export class FileUploadsModule {}
