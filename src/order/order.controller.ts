import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';

@Auth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return await this.orderService.createPayment(dto, userId);
  }
}
