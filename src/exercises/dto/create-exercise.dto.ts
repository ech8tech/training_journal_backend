import { CreateSetDto } from "@sets/dto/create-set.dto";

export class CreateExerciseDto {
  // @IsString()
  // @IsNotEmpty()
  readonly name: string;

  // @IsString()
  // @IsNotEmpty()
  readonly muscleGroup: string;

  // @IsString()
  // @IsNotEmpty()
  readonly userId: string;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateSetDto)
  readonly sets: CreateSetDto[];
}
