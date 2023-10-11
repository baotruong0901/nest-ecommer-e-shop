import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { UploadService } from 'src/upload/upload.service';
import { createCategoryParams, updateCategoryParams } from 'src/libs/category';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
        private readonly uploadService: UploadService,
    ) { }

    async createCategory(data: createCategoryParams) {
        const { name, image } = data
        try {
            const imageUpload = await this.uploadService.uploadFile(image)

            const newCategory = new this.categoryModel({
                name,
                image: imageUpload.url
            })
            return await newCategory.save()
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async updateCategory(id: string, data: updateCategoryParams) {
        const { name, image } = data
        try {
            let updateCategory = null

            if (image) {
                const imageUpload = await this.uploadService.uploadFile(image)
                updateCategory = await this.categoryModel.findByIdAndUpdate(id, {
                    name,
                    image: imageUpload.url
                }, { new: true })
            }
            updateCategory = await this.categoryModel.findByIdAndUpdate(id, {
                name
            }, { new: true })
            return updateCategory
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async deletedCategory(id: string) {
        try {
            return await this.categoryModel.findByIdAndDelete(id)
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async getAllCategories() {
        try {
            const categories = await this.categoryModel.find({}).select('name image')
            return categories
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }
}
