import { Controller } from "@nestjs/common";

import { SetsService } from "./sets.service";

@Controller("sets")
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  // @Post()
  // create(@Body() createSetDto: CreateSetDto) {
  //   return this.setsService.create(createSetDto);
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.setsService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateSetDto: UpdateSetDto) {
  //   return this.setsService.update(+id, updateSetDto);
  // }
  //
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.setsService.remove(+id);
  // }
}
