import { Product, ProductDocument } from './../../product/schema/product.schema';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Color, ColorDocument } from 'src/color/schema/color.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';


export type CartDocument = Cart & Document


@Schema({ timestamps: true })
export class Cart {
    @Prop({
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
            color: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color",
            },
            price: Number
        }],
    })
    products: {
        product: ProductDocument,
        count: number,
        color: ColorDocument,
        price: number
    }[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: UserDocument
}

export const CartSchema = SchemaFactory.createForClass(Cart);