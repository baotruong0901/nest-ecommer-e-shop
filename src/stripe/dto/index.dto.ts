import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckoutDto {

    @IsString()
    @IsNotEmpty()
    cartId: string;

    @IsString()
    @IsOptional()
    payment_intent_id: string | null
}