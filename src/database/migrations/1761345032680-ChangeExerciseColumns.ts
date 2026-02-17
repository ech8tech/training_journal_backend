import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExerciseColumns1761345032680 implements MigrationInterface {
  name = "ChangeExerciseColumns1761345032680";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Exercises" DROP CONSTRAINT "FK_26a863aef3c7266038d16904c67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ALTER COLUMN "muscleType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ALTER COLUMN "comment" TYPE text`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ADD CONSTRAINT "FK_26a863aef3c7266038d16904c67" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Exercises" DROP CONSTRAINT "FK_26a863aef3c7266038d16904c67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ALTER COLUMN "comment" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ALTER COLUMN "muscleType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Exercises" ADD CONSTRAINT "FK_26a863aef3c7266038d16904c67" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
