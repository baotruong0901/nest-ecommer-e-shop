import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
        {
            message: 'Phone must be a valid phone number'
        }
    )
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;
}

export class SigninDto {
    @Matches(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
        {
            message: 'Phone must be a valid phone number'
        }
    )
    phone: string;

    @IsString()
    @MinLength(5)
    password: string;
}