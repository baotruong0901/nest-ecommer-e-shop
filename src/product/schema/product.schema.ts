import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Brand } from "src/brand/schema/brand.schema";
import { Category } from "src/category/schema/category.schema";
import { Color } from "src/color/schema/color.schema";


export type ProductDocument = Product & Document


@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
    categories: Category[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
    brand: Brand;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }] })
    colors: Color[];

    @Prop({ required: true })
    quantity: number;

    @Prop({ default: 0 })
    sold: number;

    @Prop()
    images: string[];

    @Prop({ default: 0 })
    coupon: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);