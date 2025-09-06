import { SaveSetDto } from "@sets/dto/save-set.dto";

export class CreateExerciseDto {
  readonly name: string;
  readonly muscleGroup: string;
  readonly muscleType: string;
  readonly comment?: string;
  readonly sets: Pick<SaveSetDto, "order" | "reps" | "weight">[];
}
