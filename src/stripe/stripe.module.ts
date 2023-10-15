import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
    ])
  ],
  providers: [StripeService],
  controllers: [StripeController]
})
export class StripeModule { }
