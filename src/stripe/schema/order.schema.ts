import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Cart } from "src/cart/schema/cart.schema";
import { Product } from "src/product/schema/product.schema";
import { User } from "src/user/schema/user.schema";

export type OrderDocument = Order & Document


@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

    @Prop()
    amount: number

    @Prop()
    currency: string

    @Prop()
    status: string

    @Prop()
    deliveryStatus: string

    @Prop({ unique: true })
    payment_intent_id: string

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }] })
    products: Cart[]

}

export const OrderSchema = SchemaFactory.createForClass(Order);