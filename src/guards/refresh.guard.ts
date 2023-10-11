import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from 'jsonwebtoken'
import { Model } from "mongoose";
import { UserInfoType } from "src/decorator/getUser.decorator";
import { User, UserDocument } from "src/user/schema/user.schema";



@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context?.switchToHttp()?.getRequest()
            const token = this.extractTokenFromHeader(request)
            console.log(request?.headers?.authorization);

            if (token) {
                const payload = await jwt.verify(token, process.env.REFRESH_TOKEN_KEY!) as UserInfoType
                const user = await this.userModel.findById(payload.id)
                if (!user) throw new HttpException('Unauthorized!', 400)
                request['user'] = user
                return true
            }
            throw new HttpException('Unauthorized!', 400)
        } catch (error: any) {
            throw new HttpException('Unauthorized!', 400)
        }
    }

    private extractTokenFromHeader(request: any) {
        const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}