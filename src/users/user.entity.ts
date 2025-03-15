import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string;

  @Column({ length: 20, nullable: true })
  provider: string;

  @Column()
  hasProfile: boolean;

  @Column({ length: 100, nullable: true })
  refreshToken: string;
}
