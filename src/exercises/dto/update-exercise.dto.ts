import { CreateSetDto } from "@sets/dto/create-set.dto";

export class UpdateExerciseDto {
  readonly isDone?: boolean;
  readonly muscleType: string;
  readonly name: string;
  readonly sets?: CreateSetDto[];
}
