import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateColorDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    code: string
}

export class UpdateColorDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    code: string
} 