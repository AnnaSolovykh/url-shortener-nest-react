import { Controller, Post, Get, Param, Body, Delete, Res, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response, Request } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shorten(@Body() dto: CreateUrlDto) {
    const url = await this.urlService.createShortUrl(dto);
    return {
      shortUrl: `http://localhost:3000/${url.alias}`,
    };
  }

  @Get(':alias')
  async redirect(@Param('alias') alias: string, @Res() res: Response, @Req() req: Request) {
    const url = await this.urlService.findByAlias(alias, req.ip);
    return res.redirect(url.originalUrl);
  }

  @Get('info/:alias')
  async getInfo(@Param('alias') alias: string) {
    return this.urlService.getInfo(alias);
  }

  @Delete('delete/:alias')
  async delete(@Param('alias') alias: string) {
    await this.urlService.deleteByAlias(alias);
    return { message: 'Link deleted successfully' };
  }

  @Get('analytics/:alias')
  async analytics(@Param('alias') alias: string) {
    return this.urlService.getAnalytics(alias);
  }
}
