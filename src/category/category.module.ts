import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema }
    ])
  ],
  providers: [CategoryService, UploadService],
  controllers: [CategoryController]
})
export class CategoryModule { }
