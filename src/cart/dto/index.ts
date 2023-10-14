import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddToCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string

    @IsString()
    @IsNotEmpty()
    colorId: string

    @IsNumber()
    @IsNotEmpty()
    count: number
}

export class RemoveDto {
    @IsString()
    @IsNotEmpty()
    productId: string

    @IsString()
    @IsNotEmpty()
    colorId: string
}