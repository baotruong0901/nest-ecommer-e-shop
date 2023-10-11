import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    coupon: number;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    categories: string[];

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    colors: string[];
}