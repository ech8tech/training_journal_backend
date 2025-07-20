import { CreateSetDto } from "@sets/dto/create-set.dto";

export class CreateSessionDto {
  date: string;
  exerciseId: string;
  sets?: CreateSetDto[];
}

export class DeleteSessionDto {
  date: string;
}
