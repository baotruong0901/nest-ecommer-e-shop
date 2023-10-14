import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Model } from 'mongoose';
import { RemoveParam, addToCartParam } from 'src/libs/cart';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { Color, ColorDocument } from 'src/color/schema/color.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Color.name) private readonly colorModel: Model<ColorDocument>
    ) { }

    async addTocart(data: addToCartParam, userId: string) {
        try {
            const { productId, colorId, count } = data
            let cart = await this.cartModel.findOne({ user: userId })
            const product = await this.productModel.findById(productId)
            const color = await this.colorModel.findById(colorId)
            if (cart) {
                const productExists = cart.products.find((p) => p.product.toString() === product._id.toString() && p.color.toString() === color._id.toString())
                if (productExists) {
                    productExists.count += count
                    cart.markModified('products')
                } else {
                    const newProduct = {
                        product: product._id,
                        color: color._id,
                        count
                    }
                    cart.products.push(newProduct)
                }
                await cart.save()

            } else {
                cart = new this.cartModel({
                    products: [
                        {
                            product: product._id,
                            color: color._id,
                            count
                        }
                    ],
                    user: userId
                })
                await cart.save();
            }

            return cart

        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async getCart(userId: string) {
        try {
            const cart = await this.cartModel.findOne({ user: userId })
                .populate([
                    {
                        path: "products.product",
                        select: "title price categories brand images",
                        populate: {
                            path: "categories brand",
                            select: "name image"
                        }
                    },
                    {
                        path: "products.color",
                        select: 'name code'
                    },
                    {
                        path: "user",
                        select: "name avatar phone email"
                    }
                ])
            return cart
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async removeProductFromCart(userId: string, data: RemoveParam) {
        try {
            const { productId, colorId } = data
            let cart = await this.cartModel.findOne({ user: userId })

            cart.products = cart.products.filter((p) => p.product.toString() === productId && p.color.toString() === colorId)

            return cart.save()
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async deleteCart(userId: string) {
        try {
            return await this.cartModel.findOneAndDelete({ user: userId })
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }
}
