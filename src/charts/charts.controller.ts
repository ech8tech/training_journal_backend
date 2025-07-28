import { CurrentUser } from "@auth/decorators";
import { JwtAuthGuard } from "@auth/guards";
import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { User } from "@users/entities/user.entity";

import { ChartsService } from "./charts.service";

@Controller("charts")
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get("scatterplot")
  @UseGuards(JwtAuthGuard)
  getScatterplot(
    @CurrentUser() user: User,
    @Query("muscleGroup") muscleGroup: string,
    @Query("dateStart") dateStart: string,
    @Query("dateEnd") dateEnd: string,
  ) {
    return this.chartsService.getScatterplot(
      user.id,
      muscleGroup,
      dateStart,
      dateEnd,
    );
  }

  @Get("line_chart/:exerciseId")
  @UseGuards(JwtAuthGuard)
  getLineChart(
    @CurrentUser() user: User,
    @Param("exerciseId") exerciseId: string,
    @Query("dateStart") dateStart: string,
    @Query("dateEnd") dateEnd: string,
  ) {
    return this.chartsService.getLineChart(
      user.id,
      exerciseId,
      dateStart,
      dateEnd,
    );
  }

  @Get("schedule")
  @UseGuards(JwtAuthGuard)
  getSchedule(
    @CurrentUser() user: User,
    @Query("dateStart") dateStart: string,
    @Query("dateEnd") dateEnd: string,
  ) {
    return this.chartsService.getSchedule(user.id, dateStart, dateEnd);
  }
}
