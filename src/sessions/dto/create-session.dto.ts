import { SetsService } from "@sets/sets.service";

export class CreateSessionDto {
  date: string;
  exerciseId: string;
  sets: SetsService[];
}

export class DeleteSessionDto {
  date: string;
  exerciseId: string;
}
