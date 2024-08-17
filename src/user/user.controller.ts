import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';

@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.userService.toggleFavorite(productId, userId);
  }
}
