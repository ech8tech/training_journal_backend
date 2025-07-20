import { CreateSetDto } from "@sets/dto/create-set.dto";

export class CreateExerciseDto {
  readonly name: string;

  readonly muscleGroup: string;

  readonly muscleType: string;

  readonly sets: Pick<CreateSetDto, "order" | "reps" | "weight">[];
}
