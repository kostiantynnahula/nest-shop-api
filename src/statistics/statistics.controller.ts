import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main/:storeId')
  async getMainStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMainStatistics(storeId);
  }

  @Get('middle/:storeId')
  async getMiddleStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMiddleStatistics(storeId);
  }
}
