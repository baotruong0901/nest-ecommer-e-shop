import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, RemoveDto } from './dto';
import { GetUser } from 'src/decorator/getUser.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from 'src/user/schema/user.schema';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Roles([UserType.USER])
    @Post()
    addToCart(
        @Body() body: AddToCartDto,
        @GetUser('id') userId: string
    ) {
        return this.cartService.addTocart(body, userId)
    }

    @Roles([UserType.USER])
    @Get()
    getCart(
        @GetUser('id') userId: string
    ) {
        return this.cartService.getCart(userId)

    }

    @Roles([UserType.USER])
    @Patch()
    removeProductFromCart(
        @GetUser('id') userId: string,
        @Body() body: RemoveDto
    ) {
        return this.cartService.removeProductFromCart(userId, body)
    }

    @Roles([UserType.USER])
    @Delete()
    deleteCart(
        @GetUser('id') userId: string
    ) {
        return this.cartService.deleteCart(userId)
    }
}
