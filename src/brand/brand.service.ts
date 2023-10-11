import { HttpException, Injectable } from '@nestjs/common';
import { createBrandParams, updateBrandParams } from 'src/libs/brand';
import { Brand, BrandDocument } from './schema/brand.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class BrandService {

    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
        private readonly uploadService: UploadService,
    ) { }

    async createBrand(data: createBrandParams) {
        const { name, image } = data
        try {
            const imageUpload = await this.uploadService.uploadFile(image)

            const newBrand = new this.brandModel({
                name,
                image: imageUpload.url
            })
            return await newBrand.save()
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async updateBrand(id: string, data: updateBrandParams) {
        const { name, image } = data
        try {
            let updateBrand = null

            if (image) {
                const imageUpload = await this.uploadService.uploadFile(image)
                updateBrand = await this.brandModel.findByIdAndUpdate(id, {
                    name,
                    image: imageUpload.url
                }, { new: true })
            }
            updateBrand = await this.brandModel.findByIdAndUpdate(id, {
                name
            }, { new: true })
            return updateBrand
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async deletedBrand(id: string) {
        try {
            return await this.brandModel.findByIdAndDelete(id)
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async getAllBrands() {
        try {
            return await this.brandModel.find({}).select('name image')
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }
}
