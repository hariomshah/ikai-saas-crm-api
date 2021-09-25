import { Module } from '@nestjs/common';
import { RoundOffConfigService } from './round-off-config.service'
import { RoundOffConfigController } from './round-off-config.controller'

@Module({
    controllers: [RoundOffConfigController],
    providers: [RoundOffConfigService]
})
export class RoundOffConfigModule { }

