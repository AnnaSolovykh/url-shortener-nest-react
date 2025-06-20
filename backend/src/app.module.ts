import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { Url } from './url/entities/url.entity';
import { ClickStat } from './url/entities/click-stat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Url, ClickStat],
      synchronize: true, // only for development
    }),
    UrlModule,
  ],
})
export class AppModule {}
