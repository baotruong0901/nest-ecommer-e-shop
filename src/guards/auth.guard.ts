import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Roles } from "src/decorator/roles.decorator";
import { User, UserDocument } from "src/user/schema/user.schema";
import * as jwt from 'jsonwebtoken'
import { UserInfoType } from "src/decorator/getUser.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride(Roles, [
            context.getHandler(),
            context.getClass()
        ])

        if (roles) {
            try {
                const request = context?.switchToHttp()?.getRequest()
                const token = this.extractTokenFromHeader(request)
                if (!token) throw new HttpException('Unauthorized!', 400)

                const payload = await jwt.verify(token, process.env.SECRET_KEY) as UserInfoType
                const user = await this.userModel.findById(payload.id)

                if (!user) throw new HttpException('Unauthorized!', 400)
                if (roles.includes(user.userType)) {
                    request['user'] = user
                    return true
                }

                throw new HttpException('Unauthorized!', 400)
            } catch (error: any) {
                throw new HttpException("Unauthorized", 400)
            }
        }

        return true
    }

    private extractTokenFromHeader(request: any) {
        const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}