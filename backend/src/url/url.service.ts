import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { ClickStat } from './entities/click-stat.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
    @InjectRepository(ClickStat)
    private readonly statRepo: Repository<ClickStat>
  ) {}

  async createShortUrl(dto: CreateUrlDto): Promise<Url> {
    const alias = dto.alias ?? this.generateRandomAlias();

    const exists = await this.urlRepo.findOne({ where: { alias } });
    if (exists) {
      throw new ConflictException('Alias already exists');
    }

    const url = this.urlRepo.create({
      ...dto,
      alias,
    });

    return this.urlRepo.save(url);
  }

  async findByAlias(alias: string, ip?: string): Promise<Url> {
    const url = await this.urlRepo.findOne({ where: { alias } });

    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      throw new NotFoundException('Link has expired or not found');
    }

    url.clickCount += 1;
    await this.urlRepo.save(url);

    if (ip) {
      const stat = this.statRepo.create({ ip, url });
      await this.statRepo.save(stat);
    }

    return url;
  }

  private generateRandomAlias(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  async getInfo(alias: string): Promise<Partial<Url>> {
    const url = await this.urlRepo.findOne({ where: { alias } });

    if (!url) {
      throw new NotFoundException('Link not found');
    }

    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  async deleteByAlias(alias: string): Promise<void> {
    const result = await this.urlRepo.delete({ alias });

    if (result.affected === 0) {
      throw new NotFoundException('Link not found');
    }
  }
  async getAnalytics(alias: string): Promise<{ totalClicks: number; recentIps: string[] }> {
    const url = await this.urlRepo.findOne({ where: { alias } });

    if (!url) {
      throw new NotFoundException('Link not found');
    }

    const lastStats = await this.statRepo.find({
      where: { url: { id: url.id } },
      order: { clickedAt: 'DESC' },
      take: 5,
    });

    return {
      totalClicks: url.clickCount,
      recentIps: lastStats.map((stat) => stat.ip),
    };
  }
}
