import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { ClickStat } from './entities/click-stat.entity';

// Service for URL shortening business logic
@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
    @InjectRepository(ClickStat)
    private readonly statRepo: Repository<ClickStat>
  ) {}

  // Creates a new short URL with custom or generated alias
  async createShortUrl(dto: CreateUrlDto): Promise<Url> {
    const alias = dto.alias ?? this.generateRandomAlias();
    
    // Check if alias already exists
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

  // Finds URL by alias, increments click count, and saves IP statistics
  async findByAlias(alias: string, ip?: string): Promise<Url> {
    const url = await this.urlRepo.findOne({ where: { alias } });
    
    // Check if URL exists and not expired
    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      throw new NotFoundException('Link has expired or not found');
    }

    // Increment click counter
    url.clickCount += 1;
    await this.urlRepo.save(url);

    // Save click statistics with IP
    if (ip) {
      const stat = this.statRepo.create({ ip, url });
      await this.statRepo.save(stat);
    }

    return url;
  }

  // Generates random 6-character alias
  private generateRandomAlias(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  // Returns basic URL information
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

  // Deletes URL by alias
  async deleteByAlias(alias: string): Promise<void> {
    const result = await this.urlRepo.delete({ alias });
    if (result.affected === 0) {
      throw new NotFoundException('Link not found');
    }
  }

  // Returns analytics: total clicks and last 5 IP addresses
  async getAnalytics(alias: string): Promise<{ totalClicks: number; recentIps: string[] }> {
    const url = await this.urlRepo.findOne({ where: { alias } });
    if (!url) {
      throw new NotFoundException('Link not found');
    }

    // Get last 5 click statistics
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