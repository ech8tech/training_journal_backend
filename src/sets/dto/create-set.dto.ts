export class CreateSetDto {
  // @IsInt()
  // @Min(1)
  order: number;

  // @IsInt()
  // @Min(1)
  reps: number;

  // @IsNumber()
  weight: number;

  userId: string;

  // @IsUUID()
  exerciseId: string;

  // @IsUUID()
  // @IsOptional()
  sessionId: string | null;
}
