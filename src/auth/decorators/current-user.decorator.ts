import { Request } from "express";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@users/entities/user.entity";

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    return context.switchToHttp().getRequest<Request & User>()?.user;
  },
);
