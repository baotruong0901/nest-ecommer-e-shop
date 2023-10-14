import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Cart, CartSchema } from './schema/cart.schema';
import { Color, ColorSchema } from 'src/color/schema/color.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema }
    ]),
    MongooseModule.forFeature([
      { name: Color.name, schema: ColorSchema }
    ])
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule { }
