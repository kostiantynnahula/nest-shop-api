import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map((item) => ({
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
      price: item.price,
      quantity: item.quantity,
    }));

    const total = dto.items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems,
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // TODO: Implement the process of creating a payment link with stripe
    const payment = `https://payment-service.com/pay/${order.id}`;

    return { payment };
  }

  async updateStatus(data: any) {
    // TODO: Implement the process of updating the status of an order
    // 1. check order event type
    // 2. parse order metadata
    // 3. get order id
    // 4. update order status

    return true;
  }
}
