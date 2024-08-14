import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/utils/services/prisma.service';

dayjs.locale('en');

// TODO: move this to a separate file (create a new file smth like constants.ts)
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getMainStatistics(storeId: string) {
    const totalRevenue = await this.calculateTotalRevenue(storeId);
    const productsCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);
    const averageRating = await this.calculateAverageProductRating(storeId);

    return [
      {
        id: 1,
        name: 'Revenue',
        value: totalRevenue,
      },
      {
        id: 2,
        name: 'Products',
        value: productsCount,
      },
      {
        id: 3,
        name: 'Categories',
        value: categoriesCount,
      },
      {
        id: 4,
        name: 'Average rating',
        value: averageRating || 0,
      },
    ];
  }

  async getMiddleStatistics(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);
    const lastUsers = await this.getLastUsers(storeId);

    return { monthlySales, lastUsers };
  }

  // TODO: Refactor this function
  private async calculateMonthlySales(storeId: string) {
    const startDate = dayjs().subtract(3, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        items: {
          some: {
            storeId,
          },
        },
      },
      include: {
        items: true,
      },
    });

    // TODO: move this to a separate function
    const formatDate = (date: Date): string => {
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    };

    const salesByDate = new Map<string, number>();

    salesRaw.forEach((order) => {
      const date = formatDate(order.createdAt);

      const total = order.items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      if (salesByDate.has(date)) {
        salesByDate.set(date, salesByDate.get(date) + total);
      } else {
        salesByDate.set(date, total);
      }
    });

    const monthlySales = Array.from(salesByDate).map(([date, value]) => ({
      date,
      value,
    }));

    return monthlySales;
  }

  private async getLastUsers(storeId: string) {
    const lastUsers = await this.prisma.user.findMany({
      where: {
        orders: {
          some: {
            items: { some: { storeId } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orders: {
          where: {
            items: {
              some: {
                storeId,
              },
            },
          },
          include: {
            items: {
              where: {
                storeId,
              },
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];
      const total = lastOrder.items.reduce((acc, item) => {
        return acc + item.price;
      }, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        total,
      };
    });
  }

  private async calculateTotalRevenue(storeId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              storeId,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            storeId,
          },
        },
      },
    });

    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.items.reduce((itemAcc, item) => {
        return itemAcc + item.price * item.quantity;
      }, 0);

      return acc + total;
    }, 0);

    return totalRevenue;
  }

  private async countProducts(storeId: string): Promise<number> {
    return await this.prisma.product.count({
      where: {
        storeId,
      },
    });
  }

  private async countCategories(storeId: string): Promise<number> {
    return await this.prisma.category.count({
      where: {
        storeId,
      },
    });
  }

  private async calculateAverageProductRating(
    storeId: string,
  ): Promise<number> {
    const averageRating = await this.prisma.review.aggregate({
      where: {
        storeId,
      },
      _avg: {
        rating: true,
      },
    });

    return averageRating._avg.rating;
  }
}
