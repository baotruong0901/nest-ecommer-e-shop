import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, ColorSchema } from './schema/color.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Color.name, schema: ColorSchema },
    ]),
  ],
  providers: [ColorService],
  controllers: [ColorController]
})
export class ColorModule { }
