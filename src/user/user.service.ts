import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SigninParams, SignupParams } from 'src/libs/user';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { InjectModel } from '@nestjs/mongoose';

const EXPIRE_TIME = 10 * 60 * 60 * 1000

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }

    async signup(body: SignupParams) {
        const { email, password, name, phone } = body

        const userExist = await this.userModel.findOne({ phone })

        if (userExist) {
            throw new HttpException('Phone already exists!', 400)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new this.userModel({
            email,
            name,
            phone,
            password: hashedPassword
        })

        const result = await user.save()

        return await this.generateJWT(result._id)
    }

    async signin(body: SigninParams) {
        const { phone, password } = body

        const findUser = await this.userModel.findOne({ phone })

        if (!findUser) {
            throw new HttpException('Invalid credentials!', 400)
        }

        const isValidPassword = await bcrypt.compare(password, findUser.password)

        if (!isValidPassword) {
            throw new HttpException('Wrong password!', 400)
        }

        return await this.generateJWT(findUser._id)
    }

    async refreshToken(id: string) {
        return await this.generateJWT(id)
    }

    async generateJWT(id: string) {
        const user = await this.userModel.findById(id).select('-__v -createdAt -updatedAt')

        return {
            user,
            tokens: {
                accessToken: await jwt.sign(
                    {
                        id
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: '10h'
                    }
                ),
                refreshToken: await jwt.sign(
                    {
                        id
                    },
                    process.env.REFRESH_TOKEN_KEY,
                    {
                        expiresIn: '7d'
                    }
                ),
                expriesIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
            }
        }
    }
}
