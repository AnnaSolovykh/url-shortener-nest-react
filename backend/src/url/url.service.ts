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

  // Finds URL by alias and records click statistics in transaction
  async findByAlias(alias: string, ip?: string): Promise<Url> {
    console.log(`Finding URL by alias: ${alias}, IP: ${ip}`);
    
    const url = await this.urlRepo.findOne({ where: { alias } });
    
    // Check if URL exists and not expired
    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      console.log(`URL not found or expired for alias: ${alias}`);
      throw new NotFoundException('Link has expired or not found');
    }

    console.log(`URL found: ${url.originalUrl}, current clicks: ${url.clickCount}`);

    try {
      // Record click in transaction to ensure data consistency
      await this.urlRepo.manager.transaction(async transactionalEntityManager => {
        console.log(`Starting transaction for alias: ${alias}`);
        
        const incrementResult = await transactionalEntityManager.increment(Url, { id: url.id }, 'clickCount', 1);
        console.log(`Click count incremented, affected rows: ${incrementResult.affected}`);
        
        // Save click statistics with IP
        if (ip) {
          const stat = transactionalEntityManager.create(ClickStat, { 
            ip, 
            url: { id: url.id } as Url 
          });
          const savedStat = await transactionalEntityManager.save(stat);
          console.log(`Click stat saved:`, {
            id: savedStat.id,
            ip: savedStat.ip,
            clickedAt: savedStat.clickedAt,
            urlId: url.id
          });
        } else {
          console.log(`No IP provided, skipping stat save`);
        }
        
        console.log(`Transaction completed for alias: ${alias}`);
      });
    } catch (error) {
      console.error(`Transaction failed for alias: ${alias}`, error);
      throw error;
    }

    url.clickCount += 1;
    console.log(`Returning URL with updated click count: ${url.clickCount}`);
    
    return url;
  }

  // Generates random 6-character alias
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

  // Returns analytics: total clicks and last 5 IP addresses
  async getAnalytics(alias: string): Promise<{ 
    totalClicks: number; 
    recentClicks: { ip: string; time: Date }[] 
  }> {
    console.log(`Getting analytics for alias: ${alias}`);
    
    const url = await this.urlRepo.findOne({ where: { alias } });
    if (!url) {
      console.log(`URL not found for analytics: ${alias}`);
      throw new NotFoundException('Link not found');
    }

    console.log(`URL found for analytics: ${url.originalUrl}, total clicks: ${url.clickCount}`);

    // Get last 5 click statistics
    const lastStats = await this.statRepo.find({
      where: { url: { id: url.id } },
      order: { clickedAt: 'DESC' },
      take: 5,
    });

    console.log(`Found ${lastStats.length} click statistics records:`, 
      lastStats.map(s => ({ ip: s.ip, time: s.clickedAt }))
    );

    return {
      totalClicks: url.clickCount,
      recentClicks: lastStats.map((s) => ({
        ip: s.ip,
        time: s.clickedAt,
      })),
    };
  }
}