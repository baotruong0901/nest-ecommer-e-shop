import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/schema/user.schema';
import { ProductModule } from './product/product.module';
import { UploadService } from './upload/upload.service';
import { ColorModule } from './color/color.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    ProductModule,
    ColorModule,
    BrandModule,
    CategoryModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService, UploadService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
})
export class AppModule { }
