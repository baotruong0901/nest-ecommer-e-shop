import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { Cart } from 'src/cart/schema/cart.schema';
import { StripeService } from './stripe.service';
import { CartParams } from 'src/libs/stripe';
import { GetUser } from 'src/decorator/getUser.decorator';
import { UserType } from 'src/user/schema/user.schema';
import { Roles } from 'src/decorator/roles.decorator';
import { CheckoutDto } from './dto/index.dto';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Roles([UserType.ADMIN, UserType.USER])
    @Post()
    checkout(
        @Body() body: CheckoutDto,
        @GetUser('id') userId: string
    ) {
        try {
            return this.stripeService.checkout(body, userId)
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    @Roles([UserType.ADMIN, UserType.USER])
    @Get()
    getAllOrders(
        @GetUser('id') userId: string
    ) {
        try {
            return this.stripeService.getAllOrders(userId)
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    @Roles([UserType.ADMIN, UserType.USER])
    @Get(':id')
    getDetailOrder(
        @Param('id') orderId: string,
        @GetUser('id') userId: string
    ) {
        try {
            return this.stripeService.getDetailOrder(userId, orderId)
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }
}
