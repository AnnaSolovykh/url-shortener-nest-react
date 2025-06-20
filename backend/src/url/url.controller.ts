import { Controller, Post, Get, Param, Body, Delete, Res, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response, Request } from 'express';

// Controller for URL shortening operations
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  // Creates a new short URL
  @Post('shorten')
  async shorten(@Body() dto: CreateUrlDto) {
    const url = await this.urlService.createShortUrl(dto);
    return {
      shortUrl: `http://localhost:3000/${url.alias}`,
    };
  }

  // Redirects to original URL and tracks click statistics
  @Get(':alias')
  async redirect(@Param('alias') alias: string, @Res() res: Response, @Req() req: Request) {
    const url = await this.urlService.findByAlias(alias, req.ip);
    return res.redirect(url.originalUrl);
  }

  // Gets metadata about a short URL
  @Get('info/:alias')
  async getInfo(@Param('alias') alias: string) {
    return this.urlService.getInfo(alias);
  }

  // Deletes a short URL permanently
  @Delete('delete/:alias')
  async delete(@Param('alias') alias: string) {
    await this.urlService.deleteByAlias(alias);
    return { message: 'Link deleted successfully' };
  }

  // Gets analytics data for a short URL
  @Get('analytics/:alias')
  async analytics(@Param('alias') alias: string) {
    return this.urlService.getAnalytics(alias);
  }
}