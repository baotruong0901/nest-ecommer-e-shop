import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}


export class UpdateBrandDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
}