import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from 'src/user/schema/user.schema';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Roles([UserType.ADMIN])
    @Post()
    @UseInterceptors(FileInterceptor("image", multerOptions))
    createCategory(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreateCategoryDto
    ) {
        const data = { ...body, image }

        return this.categoryService.createCategory(data)
    }

    @Roles([UserType.ADMIN])
    @Patch(':id')
    @UseInterceptors(FileInterceptor("image", multerOptions))
    updateCategory(
        @UploadedFile() image: Express.Multer.File,
        @Param('id') brandId: string,
        @Body() body: UpdateCategoryDto
    ) {
        const data = { ...body, image }

        return this.categoryService.updateCategory(brandId, data)
    }

    @Roles([UserType.ADMIN])
    @Delete(':id')
    deletedCategory(
        @Param('id') brandId: string
    ) {
        return this.categoryService.deletedCategory(brandId)
    }

    @Get()
    getAllCategories() {
        return this.categoryService.getAllCategories()
    }
}
