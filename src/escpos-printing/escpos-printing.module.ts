import { Module } from '@nestjs/common';
import { EscposPrintingController } from './escpos-printing.controller';
import { EscposPrintingService } from './escpos-printing.service';

@Module({
  controllers: [EscposPrintingController],
  providers: [EscposPrintingService]
})
export class EscposPrintingModule {}

 