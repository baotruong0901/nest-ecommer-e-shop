import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, Query, Param, HttpException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from 'src/user/schema/user.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import mongoose from 'mongoose';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Roles([UserType.ADMIN])
    @Post()
    @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
    createProduct(
        @Body() body: CreateProductDto,
        @UploadedFiles() images: Express.Multer.File[]
    ) {
        const data = { ...body, images }
        return this.productService.createProduct(data)
    }

    @Get()
    getAllProduct(
        @Query('searchString') searchString: string = "",
        @Query('brand') brand: string = "",
        @Query('category') category: string = "",
        @Query('minPrice') minPrice: number,
        @Query('maxPrice') maxPrice: number,
        @Query('sold') sold: boolean = false,
        @Query('pageNumber') pageNumber: number = 1,
        @Query('pageSize') pageSize: number = 20,
    ) {
        return this.productService.getAllProduct({ searchString, category, brand, minPrice, maxPrice, pageNumber, pageSize, sold })
    }

    @Get(':id')
    getDetailProduct(
        @Param('id') productId: string
    ) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new HttpException('Invalid id', 400);
        }

        return this.productService.getDetailProduct(productId)
    }
}
