import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from 'src/cart/schema/cart.schema';
import { CartParams } from 'src/libs/stripe';
import Stripe from 'stripe';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { log } from 'console';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
        @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
            apiVersion: '2023-08-16'
        });
    }

    private calculateTotalPrice(data: Cart) {
        const totalPrice = data.products.reduce((acc, item) => {
            return acc + item.product.price * item.count * 0.000041; //VND->USD
        }, 0);
        const price = totalPrice * 100 //cent

        return price;
    }

    async checkout(data: { cartId: string, payment_intent_id: string }, userId: string) {
        const { cartId, payment_intent_id } = data

        const cart = await this.cartModel.findById(cartId).populate('products.product')

        const totalPrice = this.calculateTotalPrice(cart)

        const orderData = {
            user: userId,
            amount: totalPrice,
            currency: "usd",
            status: "pending",
            deliveryStatus: "pending",
            payment_intent_id,
            products: cartId
        }

        if (payment_intent_id) {
            const current_intent = await this.stripe.paymentIntents.retrieve(payment_intent_id)

            if (current_intent) {
                const updatedIntent = await this.stripe.paymentIntents.update(payment_intent_id, {
                    amount: totalPrice
                })

                //update order
                const existingOrder = await this.orderModel.findOne({ payment_intent_id })

                await this.orderModel.findOneAndUpdate({ payment_intent_id }, {
                    amount: totalPrice,
                    product: cartId
                }, { new: true })

                if (!existingOrder) throw new HttpException("Invalid Payment Intent", 400)

                return { paymentIntent: updatedIntent }
            }

        } else {
            //create the intent
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: totalPrice,
                currency: 'usd',
                automatic_payment_methods: { enabled: true }
            })

            //create the order
            orderData.payment_intent_id = paymentIntent.id

            await this.orderModel.create(orderData)

            return { paymentIntent }
        }
    }

    async getAllOrders(userId: string) {
        return await this.orderModel.find({ user: userId })
    }

    async getDetailOrder(userId: string, orderId: string) {
        const order = await this.orderModel.findOne({ _id: orderId, user: userId })
        if (!order) {
            throw new HttpException('Unauthorized', 400)
        }
        return order
    }
}
