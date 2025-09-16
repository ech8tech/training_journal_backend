import { SaveSetDto } from "@sets/dto/save-set.dto";

export class UpdateExerciseDto {
  readonly muscleType: string;
  readonly name: string;
  readonly comment?: string;
  readonly sets?: SaveSetDto[];
  readonly sessionId: string;
}
