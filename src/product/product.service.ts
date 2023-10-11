import { HttpException, Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createProductParams, getAllProductParams } from 'src/libs/product';
import { UploadService } from 'src/upload/upload.service';
import slugify from 'slugify';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        private readonly uploadService: UploadService,
    ) { }
    async createProduct(data: createProductParams) {
        const { title, description, price, quantity, brand, categories, colors, coupon, images } = data
        try {
            let imagesUpload = []
            for (const image of images) {
                const imageUpload = await this.uploadService.uploadFile(image)
                imagesUpload.push(imageUpload.url)
            }

            const newProduct = new this.productModel({
                title,
                slug: slugify(title),
                description,
                price,
                quantity,
                brand,
                categories,
                colors,
                coupon,
                images: imagesUpload
            })

            const result = await newProduct.save()

            return result
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async getAllProduct({ searchString, brand, category, minPrice, maxPrice, pageNumber, pageSize, sold }: getAllProductParams) {
        try {
            const query: any = {};
            if (searchString) {
                query.$or = [
                    { description: { $regex: new RegExp(searchString, 'i') } },
                    { title: { $regex: new RegExp(searchString, 'i') } },
                ];
            }

            if (brand) {
                query.brand = brand
            }

            if (category) {
                query.categories = { $in: category }
            }

            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                query.price = { $gte: minPrice, $lte: maxPrice };
            } else if (!isNaN(minPrice)) {
                query.price = { $gte: minPrice };
            } else if (!isNaN(maxPrice)) {
                query.price = { $lte: maxPrice };
            }
            console.log(query);

            if (sold) {
                return await this.productModel.find(query)
                    .sort({ createdAt: "desc", sold: "desc" })
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .populate([
                        {
                            path: "brand categories",
                            select: 'name image'
                        },
                        {
                            path: "colors",
                            select: 'name code'
                        }
                    ])
            } else {
                return await this.productModel.find(query)
                    .sort({ createdAt: "desc" })
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .populate([
                        {
                            path: "brand categories",
                            select: 'name image'
                        },
                        {
                            path: "colors",
                            select: 'name code'
                        }
                    ])
            }


        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async getDetailProduct(id: string) {
        try {
            const detailProduct = await this.productModel.findById(id)
                .populate([
                    {
                        path: "brand categories",
                        select: 'name image'
                    },
                    {
                        path: "colors",
                        select: 'name code'
                    }
                ])
            return detailProduct
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }
}
