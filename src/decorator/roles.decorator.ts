import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserType } from "src/user/schema/user.schema";

// export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles)
export const Roles = Reflector.createDecorator<UserType[]>()