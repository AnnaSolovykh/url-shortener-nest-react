import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ClickStat } from './entities/click-stat.entity';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Url, ClickStat])],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
