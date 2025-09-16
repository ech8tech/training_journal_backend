import { SaveSetDto } from "@sets/dto/save-set.dto";

export class CreateSessionDto {
  date: string;
  exerciseId: string;
  sets?: SaveSetDto[];
}

export class DeleteSessionDto {
  date: string;
}
