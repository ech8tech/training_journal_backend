import { CreateSetDto } from "@sets/dto/create-set.dto";

export class UpdateExerciseDto {
  readonly date: string;
  readonly sets: CreateSetDto[];
}
