import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum UserType {
    USER = 'USER',
    ADMIN = 'ADMIN',
}


export type UserDocument = User & Document


@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ unique: true })
    phone: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ type: String, enum: UserType, default: UserType.USER })
    userType: UserType;

    @Prop({ default: null })
    avatar: string;

    @Prop({ default: false })
    onBoarding: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);