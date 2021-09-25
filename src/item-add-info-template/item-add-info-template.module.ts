import { Module } from '@nestjs/common';
import { ItemAddInfoTemplateController } from './item-add-info-template.controller';
import { ItemAddInfoTemplateService } from './item-add-info-template.service';

@Module({
  controllers: [ItemAddInfoTemplateController],
  providers: [ItemAddInfoTemplateService]
})
export class ItemAddInfoTemplateModule {}
