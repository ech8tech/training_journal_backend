import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersExerciseDto } from './create-users-exercise.dto';

export class UpdateUsersExerciseDto extends PartialType(CreateUsersExerciseDto) {}
