import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Color, ColorDocument } from './schema/color.schema';
import { Model } from 'mongoose';
import { createColorParams, updateColorParams } from 'src/libs/color';

@Injectable()
export class ColorService {
    constructor(@InjectModel(Color.name) private readonly colorModel: Model<ColorDocument>) { }
    async createColor(body: createColorParams) {
        const { name, code } = body

        try {
            const color = new this.colorModel({
                name,
                code
            })

            const result = await color.save()

            return result
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async updateColor(id: string, body: updateColorParams) {
        const { name, code } = body

        try {
            const updateColor = await this.colorModel.findByIdAndUpdate(id, {
                name,
                code
            }, {
                new: true
            })

            return updateColor
        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }

    async deteledColor(id: string) {
        try {
            return await this.colorModel.findByIdAndDelete(id)

        } catch (error: any) {
            throw new HttpException(error, 400)
        }
    }
}
