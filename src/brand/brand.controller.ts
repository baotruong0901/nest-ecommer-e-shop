import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from 'src/user/schema/user.schema';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('brand')
export class BrandController {

    constructor(
        private readonly brandService: BrandService
    ) { }

    @Roles([UserType.ADMIN])
    @Post()
    @UseInterceptors(FileInterceptor("image", multerOptions))
    createBrand(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreateBrandDto
    ) {
        const data = { ...body, image }

        return this.brandService.createBrand(data)
    }

    @Roles([UserType.ADMIN])
    @Patch(':id')
    @UseInterceptors(FileInterceptor("image", multerOptions))
    updateBrand(
        @UploadedFile() image: Express.Multer.File,
        @Param('id') brandId: string,
        @Body() body: UpdateBrandDto
    ) {
        const data = { ...body, image }

        return this.brandService.updateBrand(brandId, data)
    }

    @Roles([UserType.ADMIN])
    @Delete(':id')
    deletedBrand(
        @Param('id') brandId: string
    ) {
        return this.brandService.deletedBrand(brandId)
    }

    @Get()
    getAllBrands() {
        return this.brandService.getAllBrands()
    }
}
