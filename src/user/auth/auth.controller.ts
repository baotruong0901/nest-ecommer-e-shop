import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { SigninDto, SignupDto } from '../dto';
import { RefreshGuard } from 'src/guards/refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) { }

    @Post('/signup')
    signup(
        @Body() body: SignupDto
    ) {
        return this.userService.signup(body)
    }

    @Post('/signin')
    signin(
        @Body() body: SigninDto
    ) {
        return this.userService.signin(body)
    }

    @UseGuards(RefreshGuard)
    @Post('refresh')
    refreshToken(
        @Req() req: any
    ) {
        return this.userService.refreshToken(req.user._id)
    }
}
