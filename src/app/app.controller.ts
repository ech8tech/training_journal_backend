import { Controller, Get } from "@nestjs/common";
import { AppService } from "src/app/app.service";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("users")
  getUsers() {
    return this.appService.getUsers();
  }
}
